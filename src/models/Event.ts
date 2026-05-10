import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    imageUrl?: string;
    registrationLink?: string;
    category: string;
    status: "UPCOMING" | "COMPLETED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        imageUrl: { type: String },
        registrationLink: { type: String },
        category: { type: String, default: "General" },
        status: {
            type: String,
            enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
            default: "UPCOMING",
        },
    },
    { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
