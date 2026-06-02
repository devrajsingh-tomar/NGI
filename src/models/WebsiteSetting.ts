import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteSetting extends Document {
    instituteName: string;
    logo?: string;
    favicon?: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    seoDefaults: {
        title: string;
        description: string;
        keywords: string;
    };
    themeSettings?: {
        primaryColor: string;
        darkModeEnabled: boolean;
    };
    floatingWidget?: {
        enabled: boolean;
        type: 'whatsapp' | 'facebook' | 'instagram' | 'youtube' | 'telegram' | 'custom';
        value: string;
        tooltipText?: string;
    };
    updatedAt: Date;
}

const WebsiteSettingSchema = new Schema<IWebsiteSetting>(
    {
        instituteName: { type: String, required: true, default: "ngit Educational Platform" },
        logo: { type: String },
        favicon: { type: String },
        contactEmail: { type: String, default: "info@ngit.in" },
        contactPhone: { type: String, default: "+91 98394 46340" },
        address: { type: String, default: "NGI Study Zone Campus" },
        socialLinks: {
            facebook: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            linkedin: { type: String },
            youtube: { type: String },
        },
        seoDefaults: {
            title: { type: String, default: "ngit - Advanced Educational Platform" },
            description: { type: String, default: "Premium online learning and mock test platform." },
            keywords: { type: String, default: "education, courses, mock tests, learning" },
        },
        themeSettings: {
            primaryColor: { type: String, default: "#D97706" },
            darkModeEnabled: { type: Boolean, default: false },
        },
        floatingWidget: {
            enabled: { type: Boolean, default: false },
            type: { type: String, enum: ['whatsapp', 'facebook', 'instagram', 'youtube', 'telegram', 'custom'], default: 'whatsapp' },
            value: { type: String, default: "" },
            tooltipText: { type: String, default: "Chat with us" },
        }
    },
    { timestamps: true }
);

const WebsiteSetting: Model<IWebsiteSetting> = mongoose.models.WebsiteSetting || mongoose.model<IWebsiteSetting>("WebsiteSetting", WebsiteSettingSchema);

export default WebsiteSetting;
