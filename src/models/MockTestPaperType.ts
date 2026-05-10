import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMockTestPaperType extends Document {
    name: string;
    courseId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MockTestPaperTypeSchema = new Schema<IMockTestPaperType>(
    {
        name: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    },
    { timestamps: true }
);

const MockTestPaperType: Model<IMockTestPaperType> = mongoose.models.MockTestPaperType || mongoose.model<IMockTestPaperType>("MockTestPaperType", MockTestPaperTypeSchema);

export default MockTestPaperType;
