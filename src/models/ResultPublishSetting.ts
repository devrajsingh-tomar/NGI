import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResultPublishSetting extends Document {
    title: string;
    description?: string;
    mockTestId: mongoose.Types.ObjectId;
    courseId?: mongoose.Types.ObjectId;
    batchIds?: mongoose.Types.ObjectId[];
    dateRange?: {
        from: Date;
        to: Date;
    };
    publishToStudentPanel: boolean;
    publishToPublicWebsite: boolean;
    isPublished: boolean;
    customHeading?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ResultPublishSettingSchema = new Schema<IResultPublishSetting>(
    {
        title: { type: String, required: true },
        description: { type: String },
        mockTestId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course" },
        batchIds: [{ type: Schema.Types.ObjectId, ref: "Batch" }],
        dateRange: {
            from: { type: Date },
            to: { type: Date },
        },
        publishToStudentPanel: { type: Boolean, default: true },
        publishToPublicWebsite: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: false },
        customHeading: { type: String },
    },
    { timestamps: true }
);

const ResultPublishSetting: Model<IResultPublishSetting> = mongoose.models.ResultPublishSetting || mongoose.model<IResultPublishSetting>("ResultPublishSetting", ResultPublishSettingSchema);

export default ResultPublishSetting;
