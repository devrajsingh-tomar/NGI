"use server";

import connectDB from "@/lib/db";
import CMSContent from "@/models/CMSContent";
import { revalidatePath } from "next/cache";

export async function updateCMSContent(key: string, data: any) {
    try {
        await connectDB();

        await CMSContent.findOneAndUpdate(
            { key },
            {
                key,
                data,
                // In a real app, we'd get the user ID from the session here
            },
            { upsert: true, new: true }
        );

        revalidatePath("/", "layout");
        revalidatePath("/(public)", "layout");
        revalidatePath("/(admin)", "layout");
        return { success: true };

    } catch (error) {
        console.error("CMS Update Error:", error);
        return { success: false, error: "Failed to update content" };
    }
}

export async function getCMSContent(key: string) {
    try {
        await connectDB();
        const content = await CMSContent.findOne({ key });
        return content ? content.data : null;
    } catch (error) {
        return null;
    }
}
