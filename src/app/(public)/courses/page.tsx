import { getDynamicPageData } from "@/app/actions/cms";
import { getPublicCourses } from "@/app/actions/courses";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import CoursesSection from "@/components/public/CoursesSection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, GraduationCap, Keyboard, Ribbon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function PublicCoursesPage() {
    const [dynamicData, coursesRes] = await Promise.all([
        getDynamicPageData("courses"),
        getPublicCourses()
    ]);
    
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];
    const publicCourses = coursesRes.success ? coursesRes.courses : [];

    const staticFallbackContent = (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <section className="relative overflow-hidden mb-16 px-4">
                <div className="absolute inset-0 bg-primary rounded-3xl mx-4 lg:mx-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay rounded-3xl mx-4 lg:mx-10" />
                <div className="relative z-10 container mx-auto px-4 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-orange-50 font-semibold text-sm uppercase tracking-wider mb-6 backdrop-blur-md">
                        Our Programs
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100">Professional Courses</span>
                    </h1>
                    <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
                        Master in-demand skills with our comprehensive IT and certification programs designed for your success.
                    </p>
                </div>
            </section>

            <CoursesSection courses={publicCourses} hideExplorer={true} />
        </div>
    );

    return (
        <div className="min-h-screen">
            <DynamicRenderer 
                sections={cmsSections} 
                staticFallback={staticFallbackContent} 
                extraData={{ courses: publicCourses, hideExplorer: true }}
            />
        </div>
    );
}
