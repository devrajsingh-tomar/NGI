import mongoose, { Schema, Document, Model } from "mongoose";

import { AttendanceStatus } from "../types/attendance";

export interface IAttendance extends Document {
    studentId: mongoose.Types.ObjectId;
    batchId?: string; // Course ID or Batch Identifier
    sessionId?: mongoose.Types.ObjectId; // Link to the dynamic session
    date: Date;
    status: AttendanceStatus;
    markedByCode: boolean; // True if marked via code
    markedBy: mongoose.Types.ObjectId; // Admin/Faculty ID or Student ID if self-marked
    remarks?: string;
    location?: {
        lat: number;
        lng: number;
        distance: number; // Distance from center in meters
        accuracy?: number;
    };
    deviceInfo?: any; // Optional device data
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        batchId: { type: String }, // Optional for now to support global attendance
        sessionId: { type: Schema.Types.ObjectId, ref: "AttendanceSession" },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: Object.values(AttendanceStatus),
            default: AttendanceStatus.PRESENT,
        },
        markedByCode: { type: Boolean, default: false },
        markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        remarks: { type: String },
        location: {
            lat: { type: Number },
            lng: { type: Number },
            distance: { type: Number },
            accuracy: { type: Number },
        },
        deviceInfo: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

// Ensure a student can only have one attendance record per day per batch (or globally if batchId missing)
AttendanceSchema.index({ studentId: 1, date: 1, batchId: 1 }, { unique: true });

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
