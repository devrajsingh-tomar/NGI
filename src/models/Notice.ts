import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
    title: string;
    description: string;
    link?: string;
    file?: string;
    noticeType: 'general' | 'exam' | 'event' | 'holiday';
    publishDate: Date;
    expiryDate?: Date;
    important: boolean;
    status: 'published' | 'draft' | 'archived';
    isActive: boolean;
    showInScroller: boolean;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NoticeSchema: Schema<INotice> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Notice title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Notice full description is required"],
        },
        link: {
            type: String,
            default: "",
        },
        file: { type: String },
        noticeType: { type: String, enum: ['general', 'exam', 'event', 'holiday'], default: 'general' },
        publishDate: { type: Date, default: Date.now },
        expiryDate: { type: Date },
        important: { type: Boolean, default: false },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
        isActive: {
            type: Boolean,
            default: true,
        },
        showInScroller: {
            type: Boolean,
            default: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Notice: Model<INotice> = mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
export default Notice;
