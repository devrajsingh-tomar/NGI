"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Laptop, Award, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultAbout = {
    title: "National Genius Institute",
    subtitle: "Empowering Since 2009",
    description: "National Genius Institute (NGI Study Zone) is a professional training institute located in Prayagraj. The institute provides a wide range of computer courses, diploma programs, government exam preparation, and typing training in both Hindi and English languages.\n\nngit aims to empower students with digital skills, practical knowledge, and career guidance so they can succeed in competitive exams and professional careers.",
};

export default function AboutSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const blockData = blocks && blocks.length > 0 ? blocks[0] : null;
    const extra = typeof blockData?.extra_data === 'string' ? JSON.parse(blockData.extra_data || "{}") : (blockData?.extra_data || {});

    const about = blockData ? {
        title: blockData.title || data?.title || defaultAbout.title,
        subtitle: blockData.subtitle || data?.subtitle || defaultAbout.subtitle,
        description: blockData.description || data?.description || defaultAbout.description,
        image: blockData.image || data?.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
    } : { ...defaultAbout, ...data };

    const descriptionParas = typeof about.description === 'string' ? about.description.split('\n\n') : [about.description];

    // Dynamic Stats & Points from extra_data or defaults
    const certifications = extra.certifications || [{ label: "ISO Certified", sub: "Quality Guaranteed", icon: ShieldCheck }];
    const legacyYears = extra.legacy_years || "15+";
    const highlightPoints = extra.points || [
        { label: "Expert Faculty", icon: Users, color: "bg-primary/10", text: "text-primary" },
        { label: "Hands-on Lab", icon: Laptop, color: "bg-secondary/10", text: "text-secondary" },
        { label: "Job Placement", icon: Award, color: "bg-emerald-500/10", text: "text-emerald-500" }
    ];
    const studentCount = extra.student_count || "5K";

    return (
        <section id="about" className="py-24 relative bg-[#FAFAF9] overflow-hidden">
            {/* Elegant Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D97706 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

            <div className="container px-6 mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

                    {/* Editorial Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Main Image Container */}
                        <div className="relative aspect-[4/5] rounded-tl-[6rem] rounded-br-[6rem] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white group">
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                            <img
                                src={about.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"}
                                alt="NGI Study Zone Learning Environment"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        {/* Floating Legacy Badge - Classic Style */}
                        <div className="absolute -top-8 -left-8 w-36 h-36 bg-white rounded-full hidden md:flex flex-col items-center justify-center text-primary shadow-2xl border-[6px] border-[#FAFAF9] animate-float z-20">
                            <div className="absolute inset-2 border border-dashed border-primary/30 rounded-full" />
                            <p className="text-4xl font-black font-serif">{legacyYears}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Years Legacy</p>
                        </div>

                        {/* Floating Glass Certification */}
                        {certifications.length > 0 && (
                            <div className="absolute -bottom-8 right-8 p-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 z-20 max-w-[240px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-orange-50 flex items-center justify-center text-primary border border-orange-100">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-tight">{certifications[0].label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{certifications[0].sub}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Sophisticated Text Side */}
                    <div className="space-y-10 lg:pl-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-orange-100 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                </span>
                                <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                    {about.subtitle}
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                {about.title.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i >= about.title.split(' ').length - 2 ? "text-primary" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </h2>

                            {about.description && (
                                <div className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-primary/20 pl-6">
                                    <div dangerouslySetInnerHTML={{ __html: about.description }} />
                                </div>
                            )}
                        </div>

                        {/* Elegant Vertical Features */}
                        <div className="space-y-4 pt-2">
                            {highlightPoints.map((point: any, idx: number) => {
                                const Icon = point.icon || CheckCircle2;
                                return (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors">{point.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Classic Call to Action Area */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 border-t border-slate-200/60">
                            <Link href={blockData?.button_link || "/about"} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-14 px-10 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all group">
                                    {blockData?.button_text || "Discover More"}
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#FAFAF9] bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-[3px] border-[#FAFAF9] bg-orange-100 flex items-center justify-center text-[10px] font-black text-primary z-10 shadow-sm">
                                        +{studentCount}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-amber-400 text-sm">
                                        ★★★★★
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Trusted By Students</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
