
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificateElement {
    id: string;
    type: "text" | "image" | "qrcode";
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation: number;
    opacity: number;
    locked: boolean;
    hidden: boolean;
    style: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        textAlign?: "left" | "center" | "right" | "justify";
        color?: string;
        letterSpacing?: number;
        lineHeight?: number;
        borderRadius?: number;
        boxShadow?: string;
        objectFit?: "contain" | "cover" | "fill";
    };
}

export interface ICertificateTemplate extends Document {
    name: string;
    description?: string;
    backgroundImage?: string;
    width: number;
    height: number;
    config: {
        format: string;
        orientation: "portrait" | "landscape";
        dpi: number;
        printMargin: number;
    };
    elements: ICertificateElement[];
    isDefault: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CertificateTemplateSchema = new Schema<ICertificateTemplate>(
    {
        name: { type: String, required: true },
        description: { type: String },
        backgroundImage: { type: String },
        width: { type: Number, default: 842 },
        height: { type: Number, default: 595 },
        config: {
            format: { type: String, default: 'A4' },
            orientation: { type: String, default: 'landscape' },
            dpi: { type: Number, default: 72 },
            printMargin: { type: Number, default: 0 }
        },
        elements: [
            {
                id: { type: String, required: true },
                type: { type: String, enum: ["text", "image", "qrcode"], required: true },
                content: { type: String, default: "" },
                x: { type: Number, default: 0 },
                y: { type: Number, default: 0 },
                width: { type: Number },
                height: { type: Number },
                rotation: { type: Number, default: 0 },
                opacity: { type: Number, default: 1 },
                locked: { type: Boolean, default: false },
                hidden: { type: Boolean, default: false },
                style: {
                    fontFamily: { type: String, default: "Inter" },
                    fontSize: { type: Number, default: 12 },
                    fontWeight: { type: String, default: "normal" },
                    textAlign: { type: String, default: "left" },
                    color: { type: String, default: "#000000" },
                    letterSpacing: { type: Number, default: 0 },
                    lineHeight: { type: Number, default: 1.2 },
                    borderRadius: { type: Number, default: 0 },
                    boxShadow: { type: String },
                    objectFit: { type: String, default: "contain" }
                }
            },
        ],
        isDefault: { type: Boolean, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const CertificateTemplate: Model<ICertificateTemplate> =
    mongoose.models.CertificateTemplate ||
    mongoose.model<ICertificateTemplate>("CertificateTemplate", CertificateTemplateSchema);

export default CertificateTemplate;
