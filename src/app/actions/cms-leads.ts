"use server";

import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { revalidatePath } from "next/cache";

export async function submitLeadAction(formData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string;
}) {
    try {
        await connectDB();
        
        const newLead = await Lead.create({
            ...formData,
            status: "New"
        });

        revalidatePath("/admin/content/forms");
        
        return { 
            success: true, 
            message: "Transmission received. Our intelligence team will respond shortly." 
        };
    } catch (error: any) {
        console.error("Lead Submission Error:", error);
        return { 
            success: false, 
            error: "Neural link failed. Please retry your transmission." 
        };
    }
}

export async function getLeadsAction() {
    try {
        await connectDB();
        const leads = await Lead.find().sort({ createdAt: -1 }).lean();
        return { success: true, leads: JSON.parse(JSON.stringify(leads)) };
    } catch (error) {
        return { success: false, leads: [] };
    }
}

export async function updateLeadStatusAction(id: string, status: string) {
    try {
        await connectDB();
        await Lead.findByIdAndUpdate(id, { status });
        revalidatePath("/admin/content/forms");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
