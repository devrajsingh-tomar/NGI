
import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    title?: string;
    category?: string;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const MediaSchema: Schema = new Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    title: { type: String },
    category: { type: String, default: "Others" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
