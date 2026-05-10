"use client";

import { Trophy, User, ChevronRight, Zap, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PublicResultsGridProps {
    results: any[];
    data?: any;
}

export default function PublicResultsGrid({ results, data }: PublicResultsGridProps) {
    const title = data?.section_name || "Academic Hall of Fame";
    const subtitle = data?.subtitle || "Recent Results";
    const description = data?.description || "Celebrating the exceptional performance and dedication of our top-performing students across various assessment modules.";

    if (!results || results.length === 0) {
        return (
            <section id="results" className="py-24 bg-white relative">
                 <div className="container px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-4">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                                {subtitle}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{title}</h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            No recent records found. The next generation of leaders is currently in the making.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="results" className="py-24 bg-white relative overflow-hidden">
            {/* Artistic background blur */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container px-6 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-4">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                                {subtitle}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            {title}
                        </h2>
                    </div>
                    
                    <Link href="/results" className="inline-flex items-center gap-2 px-8 h-14 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl group">
                        View All Toppers & Exam Results
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.slice(0, 6).map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group h-full"
                        >
                            <div className="h-full flex flex-col p-8 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                                {/* Rank Ribbon */}
                                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-white rounded-xl text-[10px] font-black italic">
                                    <Trophy className="w-3 h-3 text-secondary" />
                                    RANK #{item.rank || (idx + 1)}
                                </div>

                                {/* Student Profile */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden bg-slate-50 border-4 border-slate-50 group-hover:border-primary/5 transition-all duration-500">
                                        {item.studentId?.photoUrl ? (
                                            <Image 
                                                src={item.studentId.photoUrl} 
                                                alt={item.studentId.name} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <User className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                                            {item.studentId?.name || "NGITian Topper"}
                                        </h4>
                                        <p className="text-[10px] font-black text-slate-400 truncate uppercase mt-0.5 tracking-tighter">
                                            {item.mockTestId?.title || "Advanced Proficiency"}
                                        </p>
                                    </div>
                                </div>

                                {/* Score Section */}
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Final Score</p>
                                            <h5 className="text-3xl font-black text-slate-950 italic">
                                                {item.score} <span className="text-slate-300 text-lg font-medium not-italic">/ {item.totalMarks}</span>
                                            </h5>
                                        </div>
                                        <div className="w-14 h-14 rounded-full border-4 border-emerald-50 text-emerald-500 flex items-center justify-center font-black italic text-sm bg-emerald-500/5 group-hover:scale-110 transition-transform">
                                            {Math.round((item.score / item.totalMarks) * 100)}%
                                        </div>
                                    </div>
                                    
                                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(item.score / item.totalMarks) * 100}%` }}
                                            viewport={{ once: true }}
                                            className="bg-primary h-full rounded-full transition-all duration-1000"
                                        />
                                    </div>

                                    {/* Detailed Stats */}
                                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                                        <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                                            <Target className="w-4 h-4 text-primary mb-1.5" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Percentile</p>
                                            <p className="text-lg font-black text-slate-900 italic">{item.percentile}%</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-500 mb-1.5" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                                            <p className="text-[11px] font-black text-emerald-600 uppercase italic">Qualified</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
 
                 {/* View All Bottom CTA */}
                 <div className="mt-20 text-center">
                    <Link href="/results" className="inline-flex items-center gap-3 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[11px] transition-colors group">
                        Enter Full results Portal & Hall of Fame
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
