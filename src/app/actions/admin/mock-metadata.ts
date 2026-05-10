"use server";

import connectDB from "@/lib/db";
import MockTestCategory from "@/models/MockTestCategory";
import MockTestPaperType from "@/models/MockTestPaperType";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Category Actions
export async function getCategories(courseId?: string) {
    await connectDB();
    const query = courseId ? { courseId } : {};
    const categories = await MockTestCategory.find(query).sort({ name: 1 }).lean();
    return { success: true, categories: JSON.parse(JSON.stringify(categories)) };
}

export async function createCategory(name: string, courseId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    await connectDB();
    const category = await MockTestCategory.create({ name, courseId });
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
}

export async function deleteCategory(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    await connectDB();
    await MockTestCategory.findByIdAndDelete(id);
    return { success: true };
}

// Paper Type Actions
export async function getPaperTypes(courseId?: string) {
    await connectDB();
    const query = courseId ? { courseId } : {};
    const paperTypes = await MockTestPaperType.find(query).sort({ name: 1 }).lean();
    return { success: true, paperTypes: JSON.parse(JSON.stringify(paperTypes)) };
}

export async function createPaperType(name: string, courseId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    await connectDB();
    const paperType = await MockTestPaperType.create({ name, courseId });
    return { success: true, paperType: JSON.parse(JSON.stringify(paperType)) };
}

export async function deletePaperType(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    await connectDB();
    await MockTestPaperType.findByIdAndDelete(id);
    return { success: true };
}
