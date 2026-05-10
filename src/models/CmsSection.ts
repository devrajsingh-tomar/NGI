import mongoose, { Schema, Document } from "mongoose";

export interface ICmsSection extends Document {
    page_id: mongoose.Types.ObjectId;
    section_name: string; // e.g. "Hero Banner", "About Us"
    section_type: string; // e.g. "HeroSection", "GalleryGrid", "FacultyGrid"
    sort_order: number;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CmsSectionSchema = new Schema({
    page_id: { type: Schema.Types.ObjectId, ref: 'CmsPage', required: true },
    section_name: { type: String, required: true },
    section_type: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.CmsSection || mongoose.model<ICmsSection>("CmsSection", CmsSectionSchema);
