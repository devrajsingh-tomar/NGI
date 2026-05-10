import React from "react";
import { getCourseDetails } from "@/app/actions/courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    PlayCircle, CheckCircle2, Lock, FileText,
    Brain, Clock, BookOpen, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonType } from "@/models/Lesson";

const typeLabel: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    VIDEO: { label: "Video", icon: PlayCircle, color: "text-primary", bg: "bg-primary/10" },
    PDF: { label: "PDF", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
    QUIZ: { label: "Quiz", icon: Brain, color: "text-indigo-600", bg: "bg-indigo-50" },
};

export default async function CourseOverviewPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const data = await getCourseDetails(courseId);

    if (!data.success || !data.course) notFound();

    const { course, lessons, enrollment, completedLessonIds = [] } = data;

    // Which lesson to resume
    const lastId = enrollment?.lastWatchedLessonId?._id ?? enrollment?.lastWatchedLessonId;
    const nextLesson =
        lastId
            ? lessons.find((l: any) => l._id.toString() === lastId.toString()) ?? lessons[0]
            : lessons[0];

    const completedCount = completedLessonIds.length;
    const progressPct = enrollment?.progress ?? 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500">

            {/* Hero Banner Card */}
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 text-center space-y-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/10 to-indigo-50 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-primary mx-auto shadow-sm ring-4 ring-white">
                        <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{course.title}</h1>
                        {course.description && (
                            <p className="text-slate-500 leading-relaxed max-w-xl mx-auto text-sm md:text-base font-medium opacity-80">{course.description}</p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 pt-2">
                        <div className="bg-slate-50/50 rounded-2xl p-3 md:p-4 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Content</p>
                            <p className="font-black text-slate-900 flex items-center justify-center gap-1.5 text-sm md:text-base">
                                <BookOpen className="w-4 h-4 text-primary" /> {lessons.length} Lessons
                            </p>
                        </div>
                        <div className="bg-slate-50/50 rounded-2xl p-3 md:p-4 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Velocity</p>
                            <p className="font-black text-slate-900 flex items-center justify-center gap-1.5 text-sm md:text-base">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {completedCount} Done
                            </p>
                        </div>
                        <div className="bg-emerald-50/50 rounded-2xl p-3 md:p-4 border border-emerald-100 col-span-2 md:col-span-1">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Course Progress</p>
                            <p className="font-black text-emerald-700 flex items-center justify-center gap-1.5 text-sm md:text-base">
                                <Trophy className="w-4 h-4 text-emerald-500" /> {progressPct}%
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                         <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                            <div
                                className="bg-gradient-to-r from-primary via-primary to-indigo-500 h-full rounded-full transition-all duration-700 shadow-sm"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Primary Action */}
                    <div className="pt-2">
                        {lessons.length > 0 ? (
                            <Link href={`/student/courses/${courseId}/lessons/${nextLesson?._id ?? lessons[0]._id}`}>
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-2xl text-base md:text-lg font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-indigo-600"
                                >
                                    {progressPct > 0 ? "Resume Learning" : "Start First Lesson"}
                                    <PlayCircle className="w-5 h-5 fill-white" />
                                </Button>
                            </Link>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed rounded-3xl p-8 text-center text-slate-400 font-bold">
                                No lessons uploaded yet.
                            </div>
                        )}
                    </div>

                    {/* Completion Banner for Mobile/Overview */}
                    {progressPct === 100 && (
                        <div className="mt-6 p-6 md:p-8 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl text-white text-center space-y-4 shadow-2xl shadow-emerald-200 animate-in zoom-in-95 duration-700">
                            <div className="relative inline-block">
                                <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white inline-block drop-shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black">Course Complete! 🎉</h3>
                                <p className="text-emerald-50 text-xs md:text-sm font-medium mt-1 opacity-90">Outstanding achievement! Your certificate has been issued and is ready for download.</p>
                            </div>
                            <Link 
                                href="/student/certificates"
                                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg hover:scale-105 active:scale-95"
                            >
                                <FileText className="w-4 h-4" /> View My Certificate
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Lesson Roadmap */}
            {lessons.length > 0 && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center justify-between">
                        <span>Learning Roadmap</span>
                        <div className="text-right">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{completedCount} / {lessons.length} COMPLETED</p>
                        </div>
                    </h2>

                    <div className="relative pt-6">
                        {/* Vertical connector line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />

                        <div className="space-y-6">
                            {lessons.map((lesson: any, index: number) => {
                                const isCompleted = completedLessonIds.includes(lesson._id.toString());
                                const isLocked = !lesson.isFree && !enrollment?.isActive;
                                const isCurrent =
                                    nextLesson?._id?.toString() === lesson._id.toString() &&
                                    !isCompleted;
                                const meta = typeLabel[lesson.type] ?? typeLabel.VIDEO;
                                const IconComp = meta.icon;

                                return (
                                    <div key={lesson._id} className="flex items-start gap-4 md:gap-8 relative">
                                        {/* Step node */}
                                        <div className={cn(
                                            "z-10 w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shrink-0 font-black text-sm md:text-lg border-2 transition-all duration-500",
                                            isCompleted
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-200"
                                                : isCurrent
                                                    ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-110"
                                                    : isLocked
                                                        ? "bg-white border-slate-100 text-slate-200"
                                                        : "bg-white border-slate-200 text-slate-400"
                                        )}>
                                            {isCompleted
                                                ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                                                : isLocked
                                                    ? <Lock className="w-5 h-5 md:w-6 md:h-6" />
                                                    : index + 1
                                            }
                                        </div>

                                        {/* Card */}
                                        <Link
                                            href={isLocked ? "#" : `/student/courses/${courseId}/lessons/${lesson._id}`}
                                            className={cn(
                                                "flex-1 group flex items-center justify-between gap-4 border-2 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 transition-all duration-300",
                                                isCompleted
                                                    ? "bg-emerald-50/30 border-emerald-100 hover:border-emerald-300"
                                                    : isCurrent
                                                        ? "bg-white border-primary shadow-xl shadow-primary/10 -translate-y-1"
                                                        : isLocked
                                                            ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60"
                                                            : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                                                <div className={cn("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", meta.bg, meta.color)}>
                                                    <IconComp className="w-5 h-5 md:w-7 md:h-7" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={cn(
                                                        "font-black text-sm md:text-lg line-clamp-1 transition-colors",
                                                        isCompleted ? "text-emerald-800" : isCurrent ? "text-primary" : "text-slate-900"
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-widest", meta.color)}>
                                                            {meta.label}
                                                        </span>
                                                        {lesson.duration && (
                                                            <span className="flex items-center gap-1 text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                <Clock className="w-3 h-3" /> {lesson.duration}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right badge */}
                                            <div className="shrink-0">
                                                {isCompleted ? (
                                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                        ✓ Done
                                                    </span>
                                                ) : isLocked ? (
                                                    <Lock className="w-4 h-4 text-slate-300" />
                                                ) : (
                                                    <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
