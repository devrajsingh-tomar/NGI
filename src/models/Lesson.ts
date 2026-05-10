import mongoose, { Schema, Document, Model } from "mongoose";

export enum LessonType {
    VIDEO = "VIDEO",
    PDF = "PDF",
    QUIZ = "QUIZ",
    YOUTUBE_LIVE = "YOUTUBE_LIVE",
    YOUTUBE_RECORDED = "YOUTUBE_RECORDED",
}

export interface ILesson extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    type: LessonType;
    contentUrl?: string;     // YouTube URL / direct video / PDF URL
    quizId?: mongoose.Types.ObjectId; // for QUIZ type — references Quiz collection
    isFree: boolean;
    order: number;
    duration?: number;
    attachments?: {
        title: string;
        url: string;
        type: string;
        size: string;
    }[];
    // YouTube Specific Fields
    videoType?: "youtube_live" | "youtube_recorded";
    videoUrl?: string;
    videoId?: string;
    isLive?: boolean;
    scheduledDate?: Date;
    scheduledTime?: string;
    status?: "upcoming" | "live" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: Object.values(LessonType),
            default: LessonType.VIDEO,
        },
        contentUrl: { type: String },
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
        isFree: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        duration: { type: Number },
        attachments: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
                type: { type: String },
                size: { type: String },
            }
        ],
        // YouTube Specific Fields
        videoType: { type: String, enum: ["youtube_live", "youtube_recorded"] },
        videoUrl: { type: String },
        videoId: { type: String },
        isLive: { type: Boolean, default: false },
        scheduledDate: { type: Date },
        scheduledTime: { type: String },
        status: { type: String, enum: ["upcoming", "live", "completed"], default: "upcoming" },
    },
    { timestamps: true }
);

// Faster course content loading and ordering
LessonSchema.index({ courseId: 1, order: 1 });

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);

export default Lesson;
