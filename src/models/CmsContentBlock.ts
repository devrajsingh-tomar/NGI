import mongoose, { Schema, Document } from "mongoose";

export interface ICmsContentBlock extends Document {
    section_id: mongoose.Types.ObjectId;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    button_text?: string;
    button_link?: string;
    
    // New production fields
    secondary_button_text?: string;
    secondary_button_link?: string;
    is_active: boolean;
    start_date?: Date;
    end_date?: Date;
    duration?: number; // In ms
    animation?: "slide" | "fade";
    image_size?: "small" | "medium" | "large" | "full";
    object_fit?: "cover" | "contain" | "fill";
    aspect_ratio?: "16:9" | "4:3" | "1:1" | "none";
    image_position?: "center" | "top" | "bottom";
    layout?: "centered" | "left-content" | "right-content" | "full-background";
    
    sort_order: number;
    extra_data?: any;
    createdAt: Date;
    updatedAt: Date;
}

const CmsContentBlockSchema = new Schema({
    section_id: { type: Schema.Types.ObjectId, ref: 'CmsSection', required: true },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    button_text: { type: String },
    button_link: { type: String },
    
    secondary_button_text: { type: String },
    secondary_button_link: { type: String },
    is_active: { type: Boolean, default: true },
    start_date: { type: Date },
    end_date: { type: Date },
    duration: { type: Number, default: 5000 },
    animation: { type: String, enum: ["slide", "fade"], default: "slide" },
    image_size: { type: String, enum: ["small", "medium", "large", "full"], default: "full" },
    object_fit: { type: String, enum: ["cover", "contain", "fill"], default: "cover" },
    aspect_ratio: { type: String, default: "none" },
    image_position: { type: String, enum: ["center", "top", "bottom"], default: "center" },
    layout: { type: String, enum: ["centered", "left-content", "right-content", "full-background"], default: "full-background" },
    
    sort_order: { type: Number, default: 0 },
    extra_data: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.CmsContentBlock || mongoose.model<ICmsContentBlock>("CmsContentBlock", CmsContentBlockSchema);
