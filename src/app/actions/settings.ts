"use server";

import connectDB from "@/lib/db";
import WebsiteSetting from "@/models/WebsiteSetting";
import { createSafeAction } from "@/lib/safe-action";
import { UserRole } from "@/models/User";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Zod validation schema for floating widget settings list
const FloatingWidgetSettingsSchema = z.object({
    widgets: z.array(z.object({
        enabled: z.boolean(),
        type: z.enum(["whatsapp", "facebook", "instagram", "youtube", "telegram", "linkedin", "email", "custom"]),
        value: z.string().min(1, "Link or number is required"),
        tooltipText: z.string().max(50).optional().default("Chat with us"),
    }))
});

// Fetch current website settings (or create a default one if it doesn't exist)
export async function getWebsiteSettings() {
    try {
        await connectDB();
        let settings = await WebsiteSetting.findOne({}).lean();
        
        if (!settings) {
            // Create a default settings document
            const defaultSettings = await WebsiteSetting.create({
                instituteName: "NGI Study Zone",
                contactEmail: "info@ngistudyzone.com",
                contactPhone: "+91 98394 46340",
                address: "NGI Study Zone Campus",
                socialLinks: {
                    facebook: "",
                    twitter: "",
                    instagram: "",
                    linkedin: "",
                    youtube: "",
                },
                seoDefaults: {
                    title: "NGI Study Zone | Premium Education & Mock Test Platform",
                    description: "Unlock your potential with premium coaching, computer certification, and live mock exams.",
                    keywords: "education, lms, computer training, cpct, typing, government prep",
                },
                themeSettings: {
                    primaryColor: "#D97706",
                    darkModeEnabled: false,
                },
                floatingWidget: {
                    enabled: false,
                    type: "whatsapp",
                    value: "",
                    tooltipText: "Chat with us",
                },
                floatingWidgets: [
                    {
                        enabled: false,
                        type: "whatsapp",
                        value: "",
                        tooltipText: "Chat with us",
                    }
                ]
            });
            settings = JSON.parse(JSON.stringify(defaultSettings));
        } else {
            settings = JSON.parse(JSON.stringify(settings));
        }

        if (!settings.floatingWidgets) {
            settings.floatingWidgets = [];
        }

        return { success: true, settings };
    } catch (error: any) {
        console.error("Fetch Website Settings Error:", error);
        return { success: false, error: error.message || "Failed to load settings" };
    }
}

// Update floating widget configurations
export const updateFloatingWidgetSettings = createSafeAction(
    {
        schema: FloatingWidgetSettingsSchema,
        roles: [UserRole.ADMIN],
        requireAuth: true,
    },
    async (data) => {
        await connectDB();
        
        let settings = await WebsiteSetting.findOne({});
        
        if (!settings) {
            // Create new settings with the widget data
            settings = await WebsiteSetting.create({
                instituteName: "NGI Study Zone",
                floatingWidgets: data.widgets,
            });
        } else {
            // Update existing settings
            settings.floatingWidgets = data.widgets;
            await settings.save();
        }

        revalidatePath("/", "layout");
        
        return JSON.parse(JSON.stringify(settings));
    }
);
