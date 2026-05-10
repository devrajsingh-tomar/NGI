"use server";

import connectDB from "@/lib/db";
import Material from "@/models/Material";
import Enrollment from "@/models/Enrollment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMaterial(data: any) {
    try {
        await connectDB();

        const material = await Material.create(data);

        revalidatePath("/admin/materials");
        return { success: true, material: JSON.parse(JSON.stringify(material)) };
    } catch (error: any) {
        console.error("Create Material Error:", error);
        return { success: false, error: error.message || "Failed to add material" };
    }
}

export async function deleteMaterial(id: string) {
    try {
        await connectDB();
        await Material.findByIdAndDelete(id);
        revalidatePath("/admin/materials");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete material" };
    }
}

export async function getMaterials() {
    try {
        await connectDB();
        const materials = await Material.find().sort({ createdAt: -1 }).lean();
        return { success: true, materials: JSON.parse(JSON.stringify(materials)) };
    } catch (error) {
        console.error("Failed to load materials", error);
        return { success: false, error: "Failed to fetch materials" };
    }
}

export async function getStudentMaterials() {
    try {
        await connectDB();

        await import("@/models/Course");

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { success: false, error: "Unauthorized" };
        }

        const enrollments = await Enrollment.find({ userId: session.user.id })
            .populate("courseId", "title")
            .lean();

        const courseNames = enrollments
            .map((en: any) => en.courseId?.title)
            .filter(Boolean);

        const materials = await Material.find({ course: { $in: courseNames } })
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, materials: JSON.parse(JSON.stringify(materials)) };
    } catch (error: any) {
        console.error("Failed to load student materials", error);
        return { success: false, error: "Failed to fetch materials" };
    }
}
