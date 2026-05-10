import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlacementRecord extends Document {
    studentName: string;
    studentId?: mongoose.Types.ObjectId;
    companyName: string;
    companyLogo?: string;
    packageOrSalary?: string;
    roleDesignation: string;
    placementYear: number;
    courseCompleted: string;
    testimonial?: string;
    status: 'published' | 'draft' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const PlacementRecordSchema = new Schema<IPlacementRecord>(
    {
        studentName: { type: String, required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User' },
        companyName: { type: String, required: true },
        companyLogo: { type: String },
        packageOrSalary: { type: String },
        roleDesignation: { type: String, required: true },
        placementYear: { type: Number, required: true, default: new Date().getFullYear() },
        courseCompleted: { type: String, required: true },
        testimonial: { type: String },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    },
    { timestamps: true }
);

const PlacementRecord: Model<IPlacementRecord> = mongoose.models.PlacementRecord || mongoose.model<IPlacementRecord>("PlacementRecord", PlacementRecordSchema);

export default PlacementRecord;
