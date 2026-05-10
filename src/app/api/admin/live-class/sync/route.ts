import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import Notification from "@/models/Notification";
import { NotificationType } from "@/models/Notification";

// Utility logic to calculate datetime differences
function parseScheduledDateTime(date: Date, timeStr: string) {
    if (!date || !timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const scheduled = new Date(date);
    scheduled.setHours(hours, minutes, 0, 0);
    return scheduled;
}

export async function GET(request: Request) {
    try {
        await connectDB();
        
        // Find all YOUTUBE_LIVE lessons that are not yet tracking completed
        const lessons = await Lesson.find({
            type: "YOUTUBE_LIVE",
            status: { $ne: "completed" },
        }).lean();

        let updatedCount = 0;
        let notificationsSent = 0;

        const now = new Date();

        for (const lesson of lessons) {
            if (!lesson.scheduledDate || !lesson.scheduledTime) continue;

            const scheduledTime = parseScheduledDateTime(lesson.scheduledDate, lesson.scheduledTime);
            if (!scheduledTime) continue;

            const diffMins = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);

            // Fetch course students if we're near notification thresholds
            if ((diffMins <= 30 && diffMins > 25) || (diffMins <= 5 && diffMins > 0)) {
                
                // Get students enrolled in this course
                const enrollments = await Enrollment.find({ courseId: lesson.courseId }).select("userId").lean();
                
                const message = diffMins <= 5 
                    ? `Live class "${lesson.title}" is starting in less than 5 minutes! Join now!`
                    : `Live class "${lesson.title}" is starting in 30 minutes. Get ready!`;

                for (const en of enrollments) {
                    // Create in-app notification
                    await Notification.create({
                        userId: en.userId,
                        title: "Live Class Reminder",
                        message,
                        type: NotificationType.COURSE,
                        link: `/student/courses/${lesson.courseId}/lessons/${lesson._id}`,
                    });
                    notificationsSent++;
                    
                    // Here you would also call WhatsApp API or Email API
                    // WhatsAppService.sendMessage(...)
                    // EmailService.sendLiveClassReminder(...)
                }
            }

            // Update status to LIVE when it's time
            if (diffMins <= 0 && lesson.status === "upcoming") {
                await Lesson.findByIdAndUpdate(lesson._id, { status: "live" });
                updatedCount++;
            }
            
            // Update status to COMPLETED if past duration
            // duration is in minutes
            if (lesson.duration && diffMins < -(lesson.duration)) {
                await Lesson.findByIdAndUpdate(lesson._id, { status: "completed", type: "YOUTUBE_RECORDED" });
                updatedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Live classes synced and notifications sent correctly.",
            updatedCount,
            notificationsSent
        });

    } catch (error: any) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
