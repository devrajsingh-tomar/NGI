import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
    studentName: string;
    course: string;
    image?: string;
    review: string;
    rating: number;
    placementCompany?: string;
    status: 'published' | 'draft' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        studentName: { type: String, required: true },
        course: { type: String, required: true },
        image: { type: String },
        review: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
        placementCompany: { type: String },
        status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    },
    { timestamps: true }
);

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
