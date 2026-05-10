"use server";

import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import Certificate, { CertificateStatus } from "@/models/Certificate";
import Course from "@/models/Course";
import { generateCertificateNumber } from "@/lib/certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

function getGradeFromPct(pct: number): string {
    if (pct >= 90) return "A+";
    if (pct >= 75) return "A";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    return "Pass";
}

/**
 * Called when a student completes a lesson.
 * - Adds lessonId to completedLessons (no duplicates via $addToSet)
 * - Recalculates progress % from actual lesson count
 * - Auto-issues a certificate when progress reaches 100%
 */
export async function completeLesson(courseId: string, lessonId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
            return { success: false, error: "Invalid course or lesson ID" };
        }

        // Total lessons in this course
        const totalLessons = await Lesson.countDocuments({ courseId });

        // $addToSet prevents duplicates; $set updates lastWatchedLessonId safely
        const enrollment = await Enrollment.findOneAndUpdate(
            { userId: session.user.id, courseId },
            {
                $addToSet: { completedLessons: new mongoose.Types.ObjectId(lessonId) },
                $set: { lastWatchedLessonId: new mongoose.Types.ObjectId(lessonId) },
            },
            { upsert: true, new: true }
        );

        if (!enrollment) {
            return { success: false, error: "Enrollment record not found" };
        }

        // Recalculate progress accurately by filtering against existing lessons
        // This handles cases where lessons were deleted but their IDs remain in the student's history
        const allLessonIds = (await Lesson.find({ courseId }).select("_id").lean()).map(l => l._id.toString());
        const validCompletedIds = (enrollment.completedLessons || []).filter((id: any) => 
            allLessonIds.includes(id.toString())
        );

        const completedCount = validCompletedIds.length;
        const actualTotal = allLessonIds.length;
        
        const newProgress = actualTotal > 0
            ? Math.round((completedCount / actualTotal) * 100)
            : 0;

        await Enrollment.findByIdAndUpdate(enrollment._id, {
            $set: { progress: newProgress },
        });

        // ── Auto-issue certificate when course is 100% complete ──────────
        let certificateId: string | null = null;
        if (newProgress === 100) {
            const alreadyIssued = await Certificate.findOne({
                studentId: session.user.id,
                courseId,
                status: CertificateStatus.ISSUED,
            });

            if (!alreadyIssued) {
                const course = await Course.findById(courseId).lean() as any;
                const certNumber = await generateCertificateNumber(courseId);

                const cert = await Certificate.create({
                    studentId: session.user.id,
                    courseId,
                    certificateNumber: certNumber,
                    grade: getGradeFromPct(100), // completion-based
                    percentage: 100,
                    courseDuration: course?.duration ?? "Self-paced",
                    issuedDate: new Date(),
                    status: CertificateStatus.ISSUED,
                    metadata: { adminId: session.user.id, remarks: "Auto-issued on course completion" },
                });

                certificateId = cert._id.toString();
                revalidatePath("/student/certificates");
            } else {
                certificateId = alreadyIssued._id.toString();
            }
        }

        revalidatePath(`/student/courses/${courseId}`);
        revalidatePath("/student");

        return {
            success: true,
            progress: newProgress,
            completedCount,
            totalLessons,
            certificateId,
            courseComplete: newProgress === 100,
        };
    } catch (error: any) {
        console.error("Complete Lesson Error:", error);
        return { success: false, error: error?.message ?? "Failed to mark lesson complete" };
    }
}

/**
 * Lightweight tracker — just updates lastWatchedLessonId (no completion).
 */
export async function updateProgress(courseId: string, lessonId: string, progress?: number) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const updateData: Record<string, unknown> = {
            lastWatchedLessonId: lessonId,
        };
        if (progress !== undefined) updateData.progress = progress;

        await Enrollment.findOneAndUpdate(
            { userId: session.user.id, courseId },
            { $set: updateData },
            { upsert: true }
        );

        revalidatePath("/student");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update progress" };
    }
}
