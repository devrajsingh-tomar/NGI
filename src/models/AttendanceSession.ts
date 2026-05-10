import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendanceSession extends Document {
    batchId: string; // Course ID
    code: string; // Secure token for QR
    expiresAt: Date;
    isActive: boolean;
    location?: {
        lat: number;
        lng: number;
        radius: number; // meters
    };
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSessionSchema = new Schema<IAttendanceSession>(
    {
        batchId: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        location: {
            lat: { type: Number },
            lng: { type: Number },
            radius: { type: Number, default: 100 } // 100 meters default
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

// Index for finding active codes efficiently
AttendanceSessionSchema.index({ code: 1, batchId: 1, isActive: 1 });

const AttendanceSession: Model<IAttendanceSession> =
    mongoose.models.AttendanceSession ||
    mongoose.model<IAttendanceSession>("AttendanceSession", AttendanceSessionSchema);

export default AttendanceSession;
