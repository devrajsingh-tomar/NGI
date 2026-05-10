import mongoose, { Schema, Document } from "mongoose";

export interface ICmsPage extends Document {
    page_name: string; // e.g. home, about, courses, faculty, gallery, results, contact
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CmsPageSchema = new Schema({
    page_name: { type: String, required: true, unique: true },
    title: { type: String },
    description: { type: String }
}, { timestamps: true });

export default mongoose.models.CmsPage || mongoose.model<ICmsPage>("CmsPage", CmsPageSchema);
