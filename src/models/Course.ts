import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    price: number;
    isPublished: boolean;
    category: string;
    type: "ONLINE" | "OFFLINE";
    syllabusUrl?: string;
    instructorIds: mongoose.Types.ObjectId[];
    duration?: string;
    language?: string;
    level?: string;
    discountedPrice?: number;
    featuredCourse: boolean;
    seoTitle?: string;
    seoDescription?: string;
    status: 'published' | 'draft' | 'archived';
    outcomes: string[];
    highlights: string[];
    instructions?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        price: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
        category: { type: String, required: true },
        type: { type: String, enum: ["ONLINE", "OFFLINE"], default: "ONLINE" },
        syllabusUrl: { type: String },
        instructorIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
        duration: { type: String },
        language: { type: String, default: "English" },
        level: { type: String, default: "Beginner" },
        discountedPrice: { type: Number },
        featuredCourse: { type: Boolean, default: false },
        seoTitle: { type: String },
        seoDescription: { type: String },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
        outcomes: [{ type: String }],
        highlights: [{ type: String }],
        instructions: { type: String, default: "" },
    },
    { timestamps: true }
);

CourseSchema.index({ slug: 1 }, { unique: true });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
