import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string; // e.g. "Contact Form", "Landing Page"
    status: "New" | "Contacted" | "Qualified" | "Lost";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        message: { type: String, required: true, trim: true },
        source: { type: String, default: "Contact Form" },
        status: { 
            type: String, 
            enum: ["New", "Contacted", "Qualified", "Lost"], 
            default: "New" 
        },
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
