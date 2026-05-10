import mongoose, { Schema, Document, Model } from "mongoose";

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface IPaidTestRequest extends Document {
    studentId: mongoose.Types.ObjectId;
    mockTestId: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    status: RequestStatus;
    adminComment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaidTestRequestSchema = new Schema<IPaidTestRequest>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        mockTestId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        transactionId: { type: String },
        status: {
            type: String,
            enum: Object.values(RequestStatus),
            default: RequestStatus.PENDING,
        },
        adminComment: { type: String },
    },
    { timestamps: true }
);

const PaidTestRequest: Model<IPaidTestRequest> = mongoose.models.PaidTestRequest || mongoose.model<IPaidTestRequest>("PaidTestRequest", PaidTestRequestSchema);

export default PaidTestRequest;
