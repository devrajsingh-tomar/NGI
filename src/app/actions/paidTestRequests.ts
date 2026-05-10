"use server";

import connectDB from "@/lib/db";
import PaidTestRequest, { RequestStatus } from "@/models/PaidTestRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPaidTestRequests() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const requests = await PaidTestRequest.find()
            .populate("studentId", "name email")
            .populate("mockTestId", "title")
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, requests: JSON.parse(JSON.stringify(requests)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateRequestStatus(id: string, status: RequestStatus, comment?: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await PaidTestRequest.findByIdAndUpdate(id, { status, adminComment: comment });
        
        revalidatePath("/admin/mock-tests/requests");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function submitTestRequest(mockTestId: string, amount: number, paymentMethod: string, transactionId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const existing = await PaidTestRequest.findOne({ 
            studentId: session.user.id, 
            mockTestId,
            status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED] }
        });

        if (existing) return { success: false, error: "You have already requested access for this test." };

        await PaidTestRequest.create({
            studentId: session.user.id,
            mockTestId,
            amount,
            paymentMethod,
            transactionId,
            status: RequestStatus.PENDING
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
