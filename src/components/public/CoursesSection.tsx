"use client";

import { BookOpen, Users, ArrowRight, Zap, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Course {
    _id: string;
    title: string;
    description: string;
    slug: string;
    type: string;
    price: number;
    category: string;
    thumbnail: string;
}

export default function CoursesSection({ courses = [], data, hideExplorer = false }: { courses?: Course[], data?: any, hideExplorer?: boolean }) {
    const title = data?.section_name || "Choose Your Path to Mastery";
    const subtitle = data?.subtitle || "Our Premium Programs";
    const description = data?.description || "Precisely architected curriculum designed to bridge the gap between academic learning and industry demands.";

    return (
        <section id="courses" className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-4">
                        <Zap className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                            {subtitle}
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        {title}
                    </h2>
                    
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-500 flex flex-col relative group">
                                {/* Thumbnail */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image 
                                        src={course.thumbnail || "/placeholder-course.jpg"} 
                                        alt={course.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60" />
                                    
                                    {/* Category Badge */}
                                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                                        {course.category}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
                                            {course.description}
                                        </p>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Mode</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase italic">{course.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Target className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Success</p>
                                                <p className="text-[11px] font-black text-slate-900 uppercase italic">Assured</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/courses/${course.slug}`} className="mt-8">
                                        <Button className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-slate-950 text-white hover:bg-primary shadow-xl transition-all hover:scale-[1.02] group/btn border-none">
                                            Explore Curriculum
                                            <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 pt-12 border-t border-slate-50 text-center">
                    {!hideExplorer && (
                        <div className="flex flex-col items-center gap-10">
                            <Link href="/courses">
                                <Button className="h-16 px-10 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 hover:text-white hover:bg-primary hover:border-primary font-black uppercase tracking-widest text-sm transition-all shadow-xl group">
                                    See All Courses
                                    <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>

                            <div className="flex flex-col items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white text-[10px] font-black">
                                        5K+
                                    </div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                                    Join 5,000+ students already mastering new skills
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />
        </section>
    );
}
