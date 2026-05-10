"use server";

import connectDB from "@/lib/db";
import Notice from "@/models/Notice";
import { revalidatePath } from "next/cache";

export async function getNotices(showInactive = false) {
    try {
        await connectDB();
        const filter = showInactive ? {} : { isActive: true };
        const notices = await Notice.find(filter).sort({ date: -1 }).lean();
        
        return {
            success: true,
            notices: JSON.parse(JSON.stringify(notices))
        };
    } catch (error) {
        return { success: false, error: "Failed to load notices" };
    }
}

export async function createNotice(data: any) {
    try {
        await connectDB();
        const notice = await Notice.create(data);
        revalidatePath("/", "layout");
        revalidatePath("/(public)");
        revalidatePath("/notices");
        return { success: true, notice: JSON.parse(JSON.stringify(notice)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateNotice(id: string, data: any) {
    try {
        await connectDB();
        const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
        if (!notice) return { success: false, error: "Not found" };
        revalidatePath("/", "layout");
        revalidatePath("/(public)");
        revalidatePath("/notices");
        return { success: true, notice: JSON.parse(JSON.stringify(notice)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteNotice(id: string) {
    try {
        await connectDB();
        await Notice.findByIdAndDelete(id);
        revalidatePath("/", "layout");
        revalidatePath("/(public)");
        revalidatePath("/notices");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
