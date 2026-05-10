"use server";

import connectDB from "@/lib/db";
import FeedbackModel from "@/models/Feedback";
import { createSafeAction } from "@/lib/safe-action";
import { UserRole } from "@/models/User";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ─── Schemas ───────────────────────────────────────────────────────────────

const FeedbackSchema = z.object({
    id: z.string().optional(),
    name: z.string().max(100).optional(),
    role: z.string().max(100).optional(),
    course: z.string().max(150).optional(),
    videoUrl: z.string().url("Must be a valid URL").max(500),
    aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("16:9"),
    review: z.string().max(1000).optional(),
    rating: z.number().min(1).max(5).optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
});

// ─── CREATE / UPDATE ────────────────────────────────────────────────────────

export const upsertFeedback = createSafeAction(
    {
        schema: FeedbackSchema,
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async (data) => {
        await connectDB();
        const { id, ...feedbackData } = data;

        let feedback;
        if (id) {
            feedback = await FeedbackModel.findByIdAndUpdate(
                id,
                { $set: feedbackData },
                { new: true, runValidators: true }
            );
            if (!feedback) throw new Error("Feedback not found");
        } else {
            feedback = await FeedbackModel.create(feedbackData);
        }

        revalidatePath("/", "layout");
        revalidatePath("/admin/feedback");

        return JSON.parse(JSON.stringify(feedback));
    }
);

// ─── LIST (Public - active only) ────────────────────────────────────────────

export const getPublicFeedback = createSafeAction(
    {
        schema: z.object({ limit: z.number().optional().default(12) }),
        roles: ["ANY"],
        requireAuth: false,
    },
    async (data) => {
        await connectDB();
        const feedbacks = await FeedbackModel.find({ isActive: true })
            .sort({ sortOrder: 1, createdAt: -1 })
            .limit(data.limit)
            .lean();
        return JSON.parse(JSON.stringify(feedbacks));
    }
);

// ─── LIST (Admin - all) ─────────────────────────────────────────────────────

export const listAllFeedback = createSafeAction(
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
        const [feedbacks, total] = await Promise.all([
            FeedbackModel.find({})
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(data.limit)
                .lean(),
            FeedbackModel.countDocuments(),
        ]);
        return {
            feedbacks: JSON.parse(JSON.stringify(feedbacks)),
            total,
            pages: Math.ceil(total / data.limit),
        };
    }
);

// ─── DELETE ─────────────────────────────────────────────────────────────────

export const deleteFeedback = createSafeAction(
    {
        schema: z.object({ id: z.string() }),
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async ({ id }) => {
        await connectDB();
        const feedback = await FeedbackModel.findByIdAndDelete(id);
        if (!feedback) throw new Error("Feedback not found");

        revalidatePath("/", "layout");
        revalidatePath("/admin/feedback");
        return { success: true };
    }
);

// ─── TOGGLE ACTIVE ──────────────────────────────────────────────────────────

export const toggleFeedbackActive = createSafeAction(
    {
        schema: z.object({ id: z.string(), isActive: z.boolean() }),
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async ({ id, isActive }) => {
        await connectDB();
        await FeedbackModel.findByIdAndUpdate(id, { $set: { isActive } });
        revalidatePath("/admin/feedback");
        return { success: true };
    }
);
