
"use server";

import { revalidatePath } from "next/cache";

import { saveImage } from "@/lib/file-upload";
import connectDB from "@/lib/db";
import Media from "@/models/Media";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function uploadImageAction(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const result = await saveImage(file);

        if (!result.success || !result.url) {
            return { success: false, error: result.error };
        }

        await connectDB();

        const newMedia = await Media.create({
            filename: result.filename,
            url: result.url,
            mimeType: file.type,
            size: file.size,
            title: (formData.get("title") as string) || "",
            category: (formData.get("category") as string) || "Others",
            isPublic: formData.get("isPublic") === "true",
            uploadedBy: session.user.id
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        // Convert to plain object
        return {
            success: true,
            url: result.url,
            media: JSON.parse(JSON.stringify(newMedia))
        };

    } catch (error: any) {
        console.error("Upload Action Error:", error);
        return { success: false, error: "Upload failed" };
    }
}

export async function getGalleryImages(isOnlyPublic = false) {
    try {
        await connectDB();
        const query = isOnlyPublic ? { isPublic: true } : {};
        const images = await Media.find(query).sort({ createdAt: -1 }).lean();
        return { success: true, images: JSON.parse(JSON.stringify(images)) };
    } catch (error) {
        console.error("Fetch Gallery Error:", error);
        return { success: false, images: [] };
    }
}

export async function deleteImageAction(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }
        await connectDB();
        await Media.findByIdAndDelete(id);
        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete image" };
    }
}

export async function saveExternalImageUrlAction({ url, title, category, isPublic }: { url: string, title: string, category: string, isPublic?: boolean }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };
        
        await connectDB();
        
        const newMedia = await Media.create({
            filename: "external-link",
            url,
            title,
            category: category || "Others",
            isPublic: isPublic !== false,
            uploadedBy: session.user.id,
            mimeType: "image/external",
            size: 0
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");
        
        return { success: true, media: JSON.parse(JSON.stringify(newMedia)) };
    } catch (error: any) {
        console.error("External Link Error:", error);
        return { success: false, error: "Link preservation failed: " + error.message };
    }
}
