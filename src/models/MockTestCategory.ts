import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMockTestCategory extends Document {
    name: string;
    courseId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MockTestCategorySchema = new Schema<IMockTestCategory>(
    {
        name: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    },
    { timestamps: true }
);

const MockTestCategory: Model<IMockTestCategory> = mongoose.models.MockTestCategory || mongoose.model<IMockTestCategory>("MockTestCategory", MockTestCategorySchema);

export default MockTestCategory;
