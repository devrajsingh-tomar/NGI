"use server";

import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getEnrolledCourses() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const enrollments = await Enrollment.find({ userId: session.user.id })
            .populate({ path: "courseId", model: Course })
            .sort({ enrolledAt: -1 });

        return {
            success: true,
            enrollments: JSON.parse(JSON.stringify(enrollments))
        };
    } catch (error) {
        console.error("Get Enrolled Courses Error:", error);
        return { success: false, error: "Failed to load courses" };
    }
}
