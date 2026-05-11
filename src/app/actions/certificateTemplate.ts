
"use server";

import connectDB from "@/lib/db";
import CertificateTemplate, { ICertificateTemplate } from "@/models/CertificateTemplate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Font } from "@react-pdf/renderer";
import { getGoogleFontDataUrl } from "@/lib/fonts";
import { DynamicCertificateTemplate } from "@/components/certificates/DynamicCertificateTemplate";
import QRCode from "qrcode";
import React from "react";

export async function createTemplate(data: { name: string; description?: string }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        // Authorization check skipped for brevity, add back for prod

        const newTemplate = await CertificateTemplate.create({
            name: data.name,
            description: data.description,
            // elements: [], // Let schema handle default
            createdBy: session?.user?.id
        });

        revalidatePath("/admin/certificates/templates");
        return { success: true, templateId: newTemplate._id.toString() };
    } catch (error: any) {
        console.error("Create Template Error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

export async function updateTemplate(id: string, data: Partial<ICertificateTemplate>) {
    try {
        await connectDB();
        await CertificateTemplate.findByIdAndUpdate(id, data);
        revalidatePath("/admin/certificates/templates");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTemplate(id: string) {
    try {
        await connectDB();
        const template = await CertificateTemplate.findById(id);
        if (!template) return { success: false, error: "Template not found" };
        return { success: true, template: JSON.parse(JSON.stringify(template)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function listTemplates() {
    try {
        await connectDB();
        const templates = await CertificateTemplate.find().sort({ createdAt: -1 });
        return { success: true, templates: JSON.parse(JSON.stringify(templates)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTemplate(id: string) {
    try {
        await connectDB();
        await CertificateTemplate.findByIdAndDelete(id);
        revalidatePath("/admin/certificates/templates");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function setDefaultTemplate(id: string) {
    try {
        await connectDB();
        // Reset all others
        await CertificateTemplate.updateMany({}, { $set: { isDefault: false } });
        // Set this one
        await CertificateTemplate.findByIdAndUpdate(id, { $set: { isDefault: true } });

        revalidatePath("/admin/certificates/templates");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTemplatePreviewPDF(templateId: string) {
    try {
        await connectDB();
        const template = await CertificateTemplate.findById(templateId);
        if (!template) return { success: false, error: "Template not found" };

        const { renderToBuffer } = await import("@react-pdf/renderer");

        // --- SERVER-SIDE FONT REGISTRATION DISABLED PER USER REQUEST ---
        /*
        const standardFonts = ['Courier', 'Helvetica', 'Times-Roman'];
        const elements = template.elements as any[];
        const uniqueFonts = [...new Set(elements.map(el => el.style?.fontFamily || el.fontFamily || 'Helvetica'))];

        for (const font of uniqueFonts) {
            const rawFont = font as string;
            if (!standardFonts.includes(rawFont) && !rawFont.toLowerCase().includes('times') && !rawFont.toLowerCase().includes('courier')) {
                try {
                    const fontDataUrl = await getGoogleFontDataUrl(rawFont);
                    Font.register({ family: rawFont, src: fontDataUrl });
                } catch (fontErr) {
                    console.error(`DEBUG: Failed to register font ${rawFont}:`, fontErr);
                }
            }
        }
        */

        const previewQrCodeUrl = await QRCode.toDataURL("https://ngit-new.vercel.app/verify/SAMPLE");

        const heads = await headers();
        const host = heads.get("host");
        const proto = heads.get("x-forwarded-proto") || "http";
        const origin = `${proto}://${host}`;

        // Mock data for preview
        const pdfBuffer = await renderToBuffer(
            React.createElement(DynamicCertificateTemplate as any, {
                elements: template.elements as any,
                backgroundImage: template.backgroundImage,
                config: template.config as any,
                origin: origin,
                placeholders: {
                    student_name: "JOHN DOE (SAMPLE)",
                    course_name: "SOFTWARE ENGINEERING",
                    grade: "A+",
                    percentage: "98",
                    enrollment_number: "STUDENT/SAMPLE/01",
                    certificate_number: "NGI Study Zone/2026/SAMPLE/001",
                    issue_date: new Date().toLocaleDateString("en-GB", {
                        day: 'numeric', month: 'long', year: 'numeric'
                    }),
                    qr_code: previewQrCodeUrl,
                    institute_name: "NGI Study Zone Institute"
                }
            }) as any
        );

        return {
            success: true,
            pdfBase64: pdfBuffer.toString('base64'),
            filename: `Preview-${template.name.replace(/\s+/g, '-')}.pdf`
        };
    } catch (error: any) {
        return { success: false, error: "Failed to generate preview. Details: " + (error.message || "") };
    }
}
