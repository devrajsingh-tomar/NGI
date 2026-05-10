"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, BookOpen, Globe, MonitorPlay, CheckCircle, GraduationCap, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const staticReasons = [
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Trusted IT Institute", desc: "Recognized training center with a 15-year legacy of excellence.", color: "text-primary", bg: "bg-orange-50" },
    { icon: <BookOpen className="w-8 h-8" />, title: "Affordable Diplomas", desc: "Premium technical education at accessible fee structures.", color: "text-primary", bg: "bg-orange-50" },
    { icon: <Globe className="w-8 h-8" />, title: "Bilingual Learning", desc: "Flexible course delivery in Hindi & English for better understanding.", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: <MonitorPlay className="w-8 h-8" />, title: "Smart Hybrid Classes", desc: "State-of-the-art labs combined with flexible online support.", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "50+ Courses", desc: "Comprehensive curriculum from basic IT to professional diplomas.", color: "text-primary", bg: "bg-orange-50" },
    { icon: <GraduationCap className="w-8 h-8" />, title: "Govt. Exam Prep", desc: "Dedicated coaching for competitive exams & job placements.", color: "text-primary", bg: "bg-orange-50" }
];

export default function WhyChooseSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const title = data?.section_name || "Excellence in Every Lesson";
    const subtitle = data?.subtitle || "Why NGI Study Zone?";
    
    const getIcon = (name: string) => {
        switch(name) {
            case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
            case 'BookOpen': return <BookOpen className="w-8 h-8" />;
            case 'Globe': return <Globe className="w-8 h-8" />;
            case 'MonitorPlay': return <MonitorPlay className="w-8 h-8" />;
            case 'CheckCircle': return <CheckCircle className="w-8 h-8" />;
            case 'GraduationCap': return <GraduationCap className="w-8 h-8" />;
            case 'Zap': return <Zap className="w-8 h-8" />;
            default: return <ShieldCheck className="w-8 h-8" />;
        }
    };

    const displayReasons = blocks && blocks.length > 0 ? blocks.map((b, i) => {
        const extra = typeof b.extra_data === 'string' ? JSON.parse(b.extra_data || "{}") : (b.extra_data || {});
        return {
            ...staticReasons[i % staticReasons.length],
            title: b.title,
            desc: b.description,
            icon: getIcon(extra.icon)
        };
    }) : staticReasons;

    return (
        <section className="py-24 relative bg-[#FAFAF9] overflow-hidden">
            {/* Elegant Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1F2937 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            {/* Soft decorative light spheres */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-slate-600 font-black uppercase tracking-[0.25em] text-[10px]">
                            {subtitle}
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        {title.split(' ').map((word: string, i: number) => (
                            <span key={i} className={i === 1 ? "text-primary font-serif italic font-medium pr-2" : ""}>
                                {word}{" "}
                            </span>
                        ))}
                    </h2>
                    
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto border-l-2 border-primary/20 pl-4 py-1">
                        We don't just teach technology; we architect your career for the modern digital economy with precision and care.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 items-start pb-12">
                    {displayReasons.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: (idx % 3) * 0.1, duration: 0.7, ease: "easeOut" }}
                            className={cn(
                                "group relative p-10 rounded-[2.5rem] border transition-all duration-700 overflow-hidden",
                                idx % 2 === 0 
                                    ? "bg-white border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20"
                                    : "bg-gradient-to-b from-orange-50/50 to-white border-orange-100/50 hover:border-primary/30",
                                idx % 3 === 1 ? "lg:translate-y-12" : ""
                            )}
                        >
                            {/* Giant Watermark Icon */}
                            <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 pointer-events-none text-primary">
                                {typeof reason.icon.type === 'function' ? reason.icon.type({ className: "w-48 h-48" }) : reason.icon}
                            </div>
                            
                            {/* Glass Icon Container */}
                            <div className={cn(
                                "w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:-translate-y-2 shadow-sm relative z-10",
                                idx % 2 === 0 ? "bg-slate-50 text-slate-700 border border-slate-100 group-hover:bg-primary group-hover:text-white" : "bg-white text-primary border border-white group-hover:border-primary/20"
                            )}>
                                {typeof reason.icon.type === 'function' ? reason.icon.type({ className: "w-7 h-7" }) : reason.icon}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">{reason.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium relative z-10 group-hover:text-slate-800 transition-colors">
                                {reason.desc}
                            </p>
                            
                            {/* Classic Expansion Line & Text */}
                            <div className="mt-10 flex items-center gap-3 relative z-10">
                                <div className="h-[2px] w-8 bg-slate-200 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 duration-500">
                                    Discover
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
