"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getCourseDetails } from "@/app/actions/courses";
import Link from "next/link";
import { CheckCircle, Lock, PlayCircle, FileText, Brain, ChevronLeft, Trophy, Globe, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
    _id: string;
    title: string;
    type: string;
    duration?: string;
    isFree: boolean;
    order: number;
}

interface Props {
    courseId: string;
    /** Passed from server layout as initial snapshot — client refreshes after every action */
    initialCompletedIds: string[];
    initialProgress: number;
    initialCompletedCount: number;
    totalLessons: number;
    courseName: string;
    enrollmentIsActive: boolean;
    activeLessonId?: string; // current lessonId from URL
    lessons: Lesson[];
}

const typeIcon = (type: string) => {
    switch (type) {
        case "VIDEO": return <PlayCircle className="w-3.5 h-3.5" />;
        case "PDF": return <FileText className="w-3.5 h-3.5" />;
        case "QUIZ": return <Brain className="w-3.5 h-3.5" />;
        case "YOUTUBE_LIVE": return <Globe className="w-3.5 h-3.5 text-red-500" />;
        case "YOUTUBE_RECORDED": return <Video className="w-3.5 h-3.5 text-blue-500" />;
        default: return <PlayCircle className="w-3.5 h-3.5" />;
    }
};
export default function CourseSidebar({
    courseId,
    initialCompletedIds,
    initialProgress,
    initialCompletedCount,
    totalLessons,
    courseName,
    enrollmentIsActive,
    activeLessonId,
    lessons,
}: Props) {
    const routerParams = useParams();
    const currentLessonId = (routerParams.lessonId as string) || activeLessonId;

    const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds);
    const [progress, setProgress] = useState(initialProgress);
    const [completedCount, setCompleted] = useState(initialCompletedCount);

    // Sync local state when server props change (triggered by router.refresh())
    useEffect(() => {
        setCompletedIds(initialCompletedIds);
        setCompleted(initialCompletedCount);
        setProgress(initialProgress);
    }, [initialCompletedIds, initialCompletedCount, initialProgress]);

    // Re-fetch from server every time the visible lessonId changes
    const refresh = useCallback(async () => {
        const res = await getCourseDetails(courseId);
        if (res.success) {
            const ids = res.completedLessonIds ?? [];
            setCompletedIds(ids);
            setCompleted(ids.length);
            setProgress(res.enrollment?.progress ?? 0);
        }
    }, [courseId]);

    useEffect(() => {
        refresh();
    }, [currentLessonId, refresh]);

    return (
        <aside className="w-full lg:w-80 xl:w-84 shrink-0 flex flex-col bg-white rounded-[2rem] border border-slate-200 overflow-hidden h-full shadow-sm">

            {/* Header */}
            <div className="p-5 border-b border-slate-100 space-y-3">
                <Link
                    href="/student/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to My Courses
                </Link>

                <h2 className="font-black text-slate-900 leading-snug line-clamp-2 text-base" title={courseName}>
                    {courseName}
                </h2>

                {/* Progress */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>{completedCount}/{totalLessons} lessons done</span>
                    <span className={progress === 100 ? "text-emerald-600" : "text-primary"}>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-700",
                            progress === 100
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : "bg-gradient-to-r from-primary to-indigo-500"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Lesson List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {lessons.map((lesson, index) => {
                    const isCompleted = completedIds.includes(lesson._id.toString());
                    const isLocked = !lesson.isFree && !enrollmentIsActive;
                    const isActive = lesson._id === activeLessonId;

                    return (
                        <Link
                            key={lesson._id}
                            href={isLocked ? "#" : `/student/courses/${courseId}/lessons/${lesson._id}`}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl transition-all group border",
                                isLocked
                                    ? "opacity-50 cursor-not-allowed border-transparent"
                                    : isCompleted
                                        ? "border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50"
                                        : isActive
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-transparent hover:bg-slate-50 hover:border-slate-200"
                            )}
                        >
                            {/* Step circle */}
                            <div className={cn(
                                "mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black transition-all",
                                isCompleted
                                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                                    : isActive
                                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                                        : isLocked
                                            ? "bg-slate-100 text-slate-400"
                                            : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                {isCompleted
                                    ? <CheckCircle className="w-4 h-4" />
                                    : isLocked
                                        ? <Lock className="w-3.5 h-3.5" />
                                        : index + 1
                                }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-semibold line-clamp-2 leading-snug transition-colors",
                                    isCompleted ? "text-emerald-700"
                                        : isActive ? "text-primary font-bold"
                                            : "text-slate-700 group-hover:text-slate-900",
                                    isLocked && "text-slate-400"
                                )}>
                                    {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className={cn(
                                        "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                        isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {typeIcon(lesson.type)} {lesson.type}
                                    </span>
                                    {lesson.duration && (
                                        <span className="text-[10px] text-slate-400 font-medium">{lesson.duration}</span>
                                    )}
                                    {isCompleted && (
                                        <span className="text-[10px] text-emerald-600 font-bold">✓ Done</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Completion Banner — Hidden on the overview page to avoid duplication with the main hero banner */}
            {(progress === 100 && activeLessonId) && (
                <div className="m-3 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center space-y-2 shadow-lg shadow-emerald-200">
                    <p className="text-2xl">🎉</p>
                    <p className="font-black text-sm">Course Complete!</p>
                    <p className="text-xs text-emerald-100">Your certificate has been issued.</p>
                    <Link
                        href="/student/certificates"
                        className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors"
                    >
                        <Trophy className="w-3.5 h-3.5" /> View Certificate
                    </Link>
                </div>
            )}
        </aside>
    );
}
