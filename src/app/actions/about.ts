"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CMSContent from "@/models/CMSContent";
import { UserRole } from "@/models/User";

const ABOUT_KEY = "ABOUT_PAGE";

export async function getAboutPageData() {
    try {
        await dbConnect();
        const content = await CMSContent.findOne({ key: ABOUT_KEY });

        return {
            success: true,
            data: content?.data || {
                hero: {
                    badge: "About Us",
                    title: "National Genius Institute",
                    subtitle: "Empowering students with digital skills, practical knowledge, and career guidance for success."
                },
                intro: {
                    title: "About NGI Study Zone",
                    text1: "National Genius Institute (NGI Study Zone) is a professional training institute located in Prayagraj. The institute provides a wide range of computer courses, diploma programs, and government exam preparation.",
                    text2: "NGI Study Zone aims to empower students with digital skills, practical knowledge, and career guidance so they can succeed in competitive exams and professional careers.",
                    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
                },
                checklist: [
                    "Diploma Programs",
                    "Computer Courses",
                    "Govt. Exam Prep"
                ],
                mission: {
                    title: "Our Mission",
                    text: "To provide affordable and practical education that prepares students for real-world careers and government examinations.",
                    icon: "Target"
                },
                vision: {
                    title: "Our Vision",
                    text: "To become a leading skill development institute that helps youth build strong digital and professional capabilities.",
                    icon: "Eye"
                },
                stats: [
                    { label: "Courses Available", value: "50+", icon: "BookOpen" },
                    { label: "Expert Faculty", value: "16+", icon: "Award" },
                    { label: "Successful Careers", value: "100%", icon: "Rocket" },
                    { label: "Smart Classrooms", value: "Classrooms & Online", icon: "MonitorPlay" }
                ]
            }
        };
    } catch (error) {
        console.error("Error fetching about data:", error);
        return { success: false, error: "Failed to fetch data" };
    }
}

export async function updateAboutPageData(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== UserRole.ADMIN) {
            return { success: false, error: "Unauthorized" };
        }

        await dbConnect();

        await CMSContent.findOneAndUpdate(
            { key: ABOUT_KEY },
            {
                data,
                updatedBy: session.user.id
            },
            { upsert: true, new: true }
        );

        revalidatePath("/about");
        return { success: true, message: "About Us page updated successfully!" };
    } catch (error) {
        console.error("Error updating about page:", error);
        return { success: false, error: "Failed to update page" };
    }
}
