import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaculty extends Document {
    name: string;
    position: string;
    email: string;
    phone: string;
    image?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
    bio?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
    {
        name: { type: String },
        position: { type: String },
        email: { type: String },
        phone: { type: String },
        image: { type: String },
        qualification: { type: String },
        experience: { type: String },
        specialization: { type: String },
        bio: { type: String },
        socialLinks: {
            facebook: { type: String },
            twitter: { type: String },
            linkedin: { type: String },
        },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
);

const Faculty: Model<IFaculty> = mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);
export default Faculty;
