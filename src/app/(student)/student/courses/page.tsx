"use client";

import { useEffect, useState, Suspense } from "react";
import { getEnrolledCourses } from "@/app/actions/student/courses";
import { PlayCircle, Clock, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

function CoursesContent() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const search = searchParams.get("s")?.toLowerCase();

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getEnrolledCourses();
            if (res.success) {
                setCourses(res.enrollments);
            } else {
                toast.error(res.error || "Failed to load courses");
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const filteredCourses = search 
        ? courses.filter(e => 
            e.courseId?.title?.toLowerCase().includes(search) || 
            e.courseId?.category?.toLowerCase().includes(search)
          )
        : courses;

    if (courses.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Courses</h1>
                    <p className="text-slate-500 mt-2">Your enrolled courses will appear here</p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                    <h2 className="text-xl font-black text-slate-900">No Active Courses Yet</h2>
                    <p className="text-slate-500 max-w-sm mt-2 font-medium text-sm">
                        You haven't enrolled in any courses yet. Explore our catalog to start learning.
                    </p>
                </div>
                <ExploreCoursesBanner />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        {search ? `Search: "${search}"` : "My Courses"}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {search ? `Found ${filteredCourses.length} results` : "Continue where you left off"}
                    </p>
                </div>
                <Link href="/courses">
                    <button className="flex items-center gap-2 border-2 border-primary/20 text-primary font-black px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all text-sm">
                        <BookOpen className="w-4 h-4" />
                        Browse More Courses
                    </button>
                </Link>
            </div>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((enrollment) => (
                        <div
                            key={enrollment._id}
                            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all overflow-hidden flex flex-col"
                        >
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                {enrollment.courseId?.thumbnail ? (
                                    <img
                                        src={enrollment.courseId.thumbnail}
                                        alt={enrollment.courseId.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                        <BookOpen className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                                    <Link href={`/student/courses/${enrollment.courseId?._id}`}>
                                        <Button className="rounded-full w-14 h-14 bg-white text-primary hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                                            <PlayCircle className="w-6 h-6 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    <span>{enrollment.courseId?.category || "General"}</span>
                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Active</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {enrollment.courseId?.title || "Untitled Course"}
                                </h3>

                                <div className="mt-auto space-y-4 pt-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                            <span>Progress</span>
                                            <span>{enrollment.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${enrollment.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <Link href={`/student/courses/${enrollment.courseId?._id}`} className="block">
                                        <Button variant="outline" className="w-full rounded-xl font-bold border-2 hover:bg-slate-50 hover:text-primary hover:border-primary/20">
                                            Continue Learning
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
                    <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No courses match your search.</p>
                </div>
            )}

            <ExploreCoursesBanner />
        </div>
    );
}

export default function StudentCoursesPage() {
    return (
        <Suspense fallback={<div>Loading courses...</div>}>
            <CoursesContent />
        </Suspense>
    );
}

function ExploreCoursesBanner() {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-primary to-violet-600 p-8 md:p-10 shadow-2xl shadow-primary/25">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-white text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full mb-4 text-xs font-black uppercase tracking-widest">
                        <BookOpen className="w-3.5 h-3.5" /> Course Catalog
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                        Want to Learn Something New?
                    </h2>
                    <p className="text-indigo-100 font-medium mt-2 max-w-md text-sm md:text-base">
                        Browse our full catalog — ADCA, O Level, Tally, Programming & more. Find your next course and enrol today.
                    </p>
                </div>
                <Link href="/courses" className="shrink-0">
                    <button className="group flex items-center gap-3 bg-white text-primary font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all hover:shadow-2xl text-base whitespace-nowrap">
                        <BookOpen className="w-5 h-5" />
                        Explore All Courses
                        <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
