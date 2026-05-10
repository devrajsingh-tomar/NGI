import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnrollment extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    enrolledAt: Date;
    progress: number; // 0 to 100
    lastWatchedLessonId?: mongoose.Types.ObjectId;
    completedLessons: mongoose.Types.ObjectId[]; // per-lesson completion tracking
    isActive: boolean;
}

const EnrollmentSchema = new Schema<IEnrollment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        lastWatchedLessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
        completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Delete cached model so hot-reload picks up schema changes (dev safety)
if (mongoose.models.Enrollment) {
    delete (mongoose.models as any).Enrollment;
}

const Enrollment: Model<IEnrollment> =
    mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
