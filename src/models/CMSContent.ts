import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICMSContent extends Document {
    key: string; // e.g., 'HOME_HERO', 'ABOUT_US', 'INFRASTRUCTURE'
    data: any; // Flexible JSON data
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CMSContentSchema = new Schema<ICMSContent>(
    {
        key: { type: String, required: true, unique: true },
        data: { type: Schema.Types.Mixed, required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const CMSContent: Model<ICMSContent> = mongoose.models.CMSContent || mongoose.model<ICMSContent>("CMSContent", CMSContentSchema);

export default CMSContent;
