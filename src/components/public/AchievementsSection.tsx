"use client";

import { Trophy, Medal, Award, Star, User, Sparkles, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AchievementsSectionProps {
    data?: any;
    blocks?: any[];
}

export default function AchievementsSection({ data, blocks }: AchievementsSectionProps) {
    const title = data?.section_name || "Success Chronicles";
    const subtitle = data?.subtitle || "Elite Achievers";
    
    const defaultRankers = [
        {
            title: "Rahul Sharma",
            subtitle: "1st Position",
            description: "Advanced Diploma in Information Technology (ADIT) - Excellence Award",
            extra_data: JSON.stringify({ rank: "RANK #01", category: "manual" })
        }
    ];

    const displayRankers = blocks && blocks.length > 0 ? blocks : defaultRankers;

    return (
        <section id="achievements" className="py-24 bg-slate-950 text-white relative overflow-hidden">
            {/* Artistic Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] -z-10" />

            <div className="container relative z-10 px-6 mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                        <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                        <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px]">
                            {subtitle}
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        {title}
                    </h2>
                    
                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        Celebrating the extraordinary milestones of our dedicated learners who have demonstrated exceptional prowess in technology and innovation.
                    </p>
                </div>

                {/* Achievers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayRankers.map((ranker, index) => (
                        <motion.div
                            key={ranker._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 relative overflow-hidden flex flex-col">
                                {/* Rank Identity */}
                                <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white rounded-xl text-[10px] font-black italic border border-white/5">
                                    <Trophy className="w-3 h-3 text-secondary" />
                                    {ranker.subtitle || "TOP TIER"}
                                </div>

                                <div className="flex items-center gap-5 mb-8">
                                    <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden bg-white/10 border-4 border-white/5 group-hover:border-primary/20 transition-all duration-500">
                                        {ranker.image ? (
                                            <Image 
                                                src={ranker.image} 
                                                alt={ranker.title} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <User className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-2xl font-black text-white tracking-tight leading-tight truncate">
                                            {ranker.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Ranking</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5">
                                        <p className="text-slate-400 font-medium leading-relaxed italic line-clamp-3">
                                            "{ranker.description || "Demonstrated exceptional mastery over architectural principles and digital transformation strategies."}"
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/[0.03] rounded-2xl text-center border border-white/5">
                                            <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Status</p>
                                            <p className="text-[11px] font-black text-white uppercase italic">Elite</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.03] rounded-2xl text-center border border-white/5">
                                            <Award className="w-4 h-4 text-secondary mx-auto mb-1" />
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Certified</p>
                                            <p className="text-[11px] font-black text-white uppercase italic">True</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
