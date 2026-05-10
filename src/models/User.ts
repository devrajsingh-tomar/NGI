import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    SUBADMIN = "SUBADMIN",
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    image?: string;
    bio?: string;
    role: UserRole;
    address?: string;
    gender?: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    enrolledCourses: mongoose.Types.ObjectId[];
    mockTestsAttempted: number;
    certificates: mongoose.Types.ObjectId[];
    status: 'active' | 'inactive' | 'suspended';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        mobile: { type: String, required: false },
        image: { type: String },
        bio: { type: String, default: "" },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        address: { type: String },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        dateOfBirth: { type: Date },
        enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        mockTestsAttempted: { type: Number, default: 0 },
        certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
        status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
