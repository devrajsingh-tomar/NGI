"use server";

import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Payment, { PaymentStatus } from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/services/RazorpayService";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import mongoose from "mongoose";
import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

const InitiatePaymentSchema = z.object({
    courseId: z.string().min(1),
});

export const initiatePayment = createSafeAction(
    { schema: InitiatePaymentSchema, requireAuth: true, rateLimit: RATE_LIMIT_CONFIGS.SENSITIVE },
    async ({ courseId }, session) => {
        await connectDB();

        let course;
        if (mongoose.Types.ObjectId.isValid(courseId)) {
            course = await Course.findById(courseId);
        } else {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) {
            throw new Error("Course not found. Check identifier.");
        }

        // Calculate pending balance instead of blindly tracking existing enrollment
        const successfulPayments = await Payment.find({
            userId: session.user.id,
            courseId: course._id,
            status: PaymentStatus.SUCCESS
        });

        const totalPaid = successfulPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const balance = course.price - totalPaid;

        if (balance <= 0) {
            // Check if enrollment already exists
            const existing = await Enrollment.findOne({ userId: session.user.id, courseId: course._id });
            if (!existing) {
                await Enrollment.create({
                    userId: session.user.id,
                    courseId: course._id,
                    enrolledAt: new Date(),
                    progress: 0,
                    isActive: true
                });
                revalidatePath("/student", "layout");
                revalidatePath("/", "layout");
                return { success: true, instant: true };
            }
            throw new Error("Course is already in your dashboard");
        }

        // Create Razorpay Order with specific balance mapping
        const order = await createRazorpayOrder(balance);

        // Save Intention in DB
        await Payment.create({
            userId: session.user.id,
            courseId: course._id,
            amount: balance,
            razorpayOrderId: order.id,
            status: PaymentStatus.PENDING,
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            courseTitle: course.title,
            userName: session.user.name,
            userEmail: session.user.email,
        };
    }
);

const VerifyPaymentSchema = z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
});

export const verifyPayment = createSafeAction(
    { schema: VerifyPaymentSchema, requireAuth: true },
    async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }, session) => {
        await connectDB();

        // 1. First, verify the payment belongs to the current user to prevent cross-user spoofing
        const paymentRecord = await Payment.findOne({ 
            razorpayOrderId,
            userId: session.user.id 
        });

        if (!paymentRecord) {
            throw new Error("Payment record not found for this user.");
        }

        // 2. Verify signature
        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            throw new Error("Invalid payment signature detected.");
        }

        // 3. Update Payment Status (Idempotent)
        if (paymentRecord.status !== PaymentStatus.SUCCESS) {
            paymentRecord.razorpayPaymentId = razorpayPaymentId;
            paymentRecord.razorpaySignature = razorpaySignature;
            paymentRecord.status = PaymentStatus.SUCCESS;
            await paymentRecord.save();

            // 4. Check/Create Enrollment (Idempotency)
            const existingEnrollment = await Enrollment.findOne({
                userId: session.user.id,
                courseId: paymentRecord.courseId
            });

            if (!existingEnrollment) {
                await Enrollment.create({
                    userId: session.user.id,
                    courseId: paymentRecord.courseId,
                    enrolledAt: new Date(),
                    progress: 0,
                    isActive: true
                });
            }

            // 5. Notify user
            await createNotification(
                session.user.id,
                "Payment Successful!",
                `You have successfully enrolled in the course. Start learning now!`,
                "SUCCESS",
                `/student/courses/${paymentRecord.courseId}`
            );
        }

        revalidatePath("/student");
        return { success: true };
    }
);

export const getMyFees = createSafeAction(
    { requireAuth: true },
    async (_, session) => {
        await connectDB();
        // Force model registration
        await import("@/models/Course");
        await import("@/models/User");

        const userId = session.user.id;

        const enrollments = await Enrollment.find({ userId })
            .populate("courseId", "title price category")
            .lean();

        const payments = await Payment.find({ userId })
            .populate("courseId", "title price")
            .lean();

        return {
            user: { name: session.user.name, email: session.user.email },
            enrollments: JSON.parse(JSON.stringify(enrollments)),
            payments: JSON.parse(JSON.stringify(payments))
        };
    }
);
