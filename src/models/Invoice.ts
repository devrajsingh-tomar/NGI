import mongoose, { Schema, Document, Model } from "mongoose";

export enum InvoiceStatus {
    PAID = "PAID",
    PARTIAL = "PARTIAL",
    PENDING = "PENDING",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}

export interface IInstallment {
    amount: number;
    dueDate: Date;
    status: InvoiceStatus;
    paidAt?: Date;
    paymentId?: mongoose.Types.ObjectId; // Link to the actual Payment transaction
}

export interface IInvoice extends Document {
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    invoiceNumber: string;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: InvoiceStatus;
    installments: IInstallment[];
    issuedDate: Date;
    dueDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InstallmentSchema = new Schema<IInstallment>({
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(InvoiceStatus),
        default: InvoiceStatus.PENDING
    },
    paidAt: { type: Date },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" }
});

const InvoiceSchema = new Schema<IInvoice>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        invoiceNumber: { type: String, required: true, unique: true },
        totalAmount: { type: Number, required: true },
        amountPaid: { type: Number, default: 0 },
        balanceDue: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(InvoiceStatus),
            default: InvoiceStatus.PENDING
        },
        installments: [InstallmentSchema],
        issuedDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

// Indexes
InvoiceSchema.index({ studentId: 1, courseId: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ dueDate: 1 });

if (mongoose.models.Invoice) {
    delete (mongoose.models as any).Invoice;
}

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
