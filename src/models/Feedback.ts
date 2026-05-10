import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    name?: string;
    role?: string;
    course?: string;
    videoUrl: string;
    aspectRatio?: "16:9" | "9:16" | "1:1";
    review?: string;
    rating?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        name: { type: String, trim: true, maxlength: 100 },
        role: { type: String, trim: true, maxlength: 100 },
        course: { type: String, trim: true, maxlength: 150 },
        videoUrl: { type: String, required: true, trim: true },
        aspectRatio: { type: String, enum: ["16:9", "9:16", "1:1"], default: "16:9" },
        review: { type: String, trim: true, maxlength: 1000 },
        rating: { type: Number, min: 1, max: 5 },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

FeedbackSchema.index({ isActive: 1, sortOrder: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
