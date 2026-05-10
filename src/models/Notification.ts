import mongoose, { Schema, Document, Model } from "mongoose";

export enum NotificationType {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    PAYMENT = "PAYMENT",
    COURSE = "COURSE",
}

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            default: NotificationType.INFO,
        },
        isRead: { type: Boolean, default: false },
        link: { type: String },
    },
    { timestamps: true }
);

// Optimize retrieval by user and sort by newest first
NotificationSchema.index({ userId: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
