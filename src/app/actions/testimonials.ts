"use server";

import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { createSafeAction } from "@/lib/safe-action";
import { UserRole } from "@/models/User";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ─── ZOD SCHEMAS ────────────────────────────────────────────────────────────

const TestimonialSchema = z.object({
    review: z.string().min(10, "Review must be at least 10 characters").max(1000),
    rating: z.number().min(1).max(5),
    course: z.string().min(2, "Course name is required").max(150),
    image: z.string().optional(),
    placementCompany: z.string().optional(),
});

const StatusUpdateSchema = z.object({
    id: z.string(),
    status: z.enum(["published", "draft", "archived"]),
});

const DeleteSchema = z.object({
    id: z.string(),
});

// ─── ACTIONS ─────────────────────────────────────────────────────────────────

// Student submits or updates their feedback
export const submitStudentFeedback = createSafeAction(
    {
        schema: TestimonialSchema,
        roles: [UserRole.STUDENT],
        requireAuth: true,
    },
    async (data, session) => {
        await connectDB();
        const studentId = session.user.id;
        const studentName = session.user.name || "Student";
        
        let testimonial = await Testimonial.findOne({ studentId });
        
        if (testimonial) {
            testimonial.review = data.review;
            testimonial.rating = data.rating;
            testimonial.course = data.course;
            if (data.image) testimonial.image = data.image;
            testimonial.placementCompany = data.placementCompany || "";
            testimonial.status = "draft"; // reset to draft for re-moderation
            await testimonial.save();
        } else {
            testimonial = await Testimonial.create({
                studentId,
                studentName,
                review: data.review,
                rating: data.rating,
                course: data.course,
                image: data.image || session.user.image || "",
                placementCompany: data.placementCompany || "",
                status: "draft",
            });
        }
        
        revalidatePath("/", "layout");
        return JSON.parse(JSON.stringify(testimonial));
    }
);

// Get the logged-in student's testimonial
export const getStudentFeedback = createSafeAction(
    {
        schema: z.object({}),
        roles: [UserRole.STUDENT],
        requireAuth: true,
    },
    async (_, session) => {
        await connectDB();
        const feedback = await Testimonial.findOne({ studentId: session.user.id }).lean();
        return JSON.parse(JSON.stringify(feedback));
    }
);

// Fetch approved testimonials for homepage (public)
export const getPublicTestimonials = createSafeAction(
    {
        schema: z.object({ limit: z.number().optional().default(10) }),
        roles: ["ANY"],
        requireAuth: false,
    },
    async ({ limit }) => {
        await connectDB();
        const testimonials = await Testimonial.find({ status: "published" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return JSON.parse(JSON.stringify(testimonials));
    }
);

// Admin lists all testimonials
export const listAllTestimonials = createSafeAction(
    {
        schema: z.object({
            page: z.number().optional().default(1),
            limit: z.number().optional().default(20),
        }),
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async (data) => {
        await connectDB();
        const skip = (data.page - 1) * data.limit;
        const [testimonials, total] = await Promise.all([
            Testimonial.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(data.limit)
                .lean(),
            Testimonial.countDocuments(),
        ]);
        return {
            testimonials: JSON.parse(JSON.stringify(testimonials)),
            total,
            pages: Math.ceil(total / data.limit),
        };
    }
);

// Admin updates testimonial status
export const updateTestimonialStatus = createSafeAction(
    {
        schema: StatusUpdateSchema,
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async ({ id, status }) => {
        await connectDB();
        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );
        if (!testimonial) throw new Error("Testimonial not found");
        revalidatePath("/", "layout");
        return JSON.parse(JSON.stringify(testimonial));
    }
);

// Admin deletes a testimonial
export const deleteTestimonial = createSafeAction(
    {
        schema: DeleteSchema,
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async ({ id }) => {
        await connectDB();
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) throw new Error("Testimonial not found");
        revalidatePath("/", "layout");
        return { success: true };
    }
);

// Admin updates testimonial details directly
const AdminUpdateTestimonialSchema = z.object({
    id: z.string(),
    studentName: z.string().min(2, "Name must be at least 2 characters"),
    course: z.string().min(2, "Course must be at least 2 characters"),
    review: z.string().min(10, "Review must be at least 10 characters"),
    rating: z.number().min(1).max(5),
    image: z.string().optional(),
    placementCompany: z.string().optional(),
    status: z.enum(["published", "draft", "archived"]),
});

export const adminUpdateTestimonial = createSafeAction(
    {
        schema: AdminUpdateTestimonialSchema,
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async (data) => {
        await connectDB();
        const { id, ...updateData } = data;
        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!testimonial) throw new Error("Testimonial not found");
        revalidatePath("/", "layout");
        return JSON.parse(JSON.stringify(testimonial));
    }
);

