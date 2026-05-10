import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { lessonId } = await params;

        await connectDB();
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        // Role-based access logic
        if (lesson.isFree) {
            return NextResponse.json({ url: lesson.contentUrl });
        }

        if (!session) {
            return NextResponse.json({ message: "Please login to view paid content" }, { status: 401 });
        }

        // Admin has full access
        if (session.user.role === "ADMIN") {
            return NextResponse.json({ url: lesson.contentUrl });
        }

        // Check if student is enrolled in the course
        // const enrollment = await Enrollment.findOne({ studentId: session.user.id, courseId: lesson.courseId });
        // if (!enrollment) {
        //   return NextResponse.json({ message: "You are not enrolled in this course" }, { status: 403 });
        // }

        // For now, allow all logged-in students if enrollment logic isn't fully built
        return NextResponse.json({ url: lesson.contentUrl });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
