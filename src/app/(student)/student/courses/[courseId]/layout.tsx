import { ReactNode } from "react";
import { getCourseDetails } from "@/app/actions/courses";
import { notFound } from "next/navigation";
import CourseSidebar from "@/components/student/CourseSidebar";
import { cn } from "@/lib/utils";

export default async function CourseLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ courseId: string; lessonId?: string }>;
}) {
    const resolvedParams = await params;
    const courseId = resolvedParams.courseId;
    const lessonId = resolvedParams.lessonId; // undefined on the overview page

    const data = await getCourseDetails(courseId);

    if (!data.success || !data.course) {
        notFound();
    }

    const { course, lessons, enrollment, completedLessonIds = [] } = data;

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-80px)]">

            {/* ── Main Content ── */}
            <div className="flex-1 overflow-y-auto rounded-[2rem] bg-indigo-50/30 md:bg-slate-50 border border-slate-200 min-w-0 p-4 md:p-0">
                {children}
            </div>

            {/* ── Client Sidebar — Hidden on mobile OVERVIEW, shown everywhere else ── */}
            <div className={cn(
                "w-full lg:w-80 xl:w-96 shrink-0",
                !lessonId && "hidden lg:block"
            )}>
                <CourseSidebar
                    courseId={courseId}
                    lessons={lessons}
                    initialCompletedIds={completedLessonIds}
                    initialProgress={enrollment?.progress ?? 0}
                    initialCompletedCount={completedLessonIds.length}
                    totalLessons={lessons.length}
                    courseName={course.title}
                    enrollmentIsActive={enrollment?.isActive ?? false}
                    activeLessonId={lessonId}
                />
            </div>
        </div>
    );
}
