"use client";

import { Users, GraduationCap, BookOpen, ShieldCheck, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultStats = [
    {
        icon: BookOpen,
        title: "Learn new skills",
        subtitle: "With flexible courses",
    },
    {
        icon: Users,
        title: "Expert Teacher",
        subtitle: "Upskill with Specialist",
    },
    {
        icon: GraduationCap,
        title: "Online Degrees",
        subtitle: "Study flexibly online",
    }
];

interface TrustIndicatorsProps {
    stats?: any[];
}

const iconMap: Record<string, any> = { BookOpen, Users, GraduationCap, ShieldCheck, Zap, Target };

export default function TrustIndicators({ stats }: TrustIndicatorsProps) {
    // Determine the array of stats to show (max 3 for the strip look)
    const displayStats = stats && stats.length > 0 ? stats.slice(0, 3).map((s, i) => {
        const base = defaultStats[i % defaultStats.length];
        const CustomIcon = s.icon_name ? iconMap[s.icon_name] : null;
        
        return {
            ...base,
            icon: CustomIcon || base.icon,
            title: s.label || s.title || base.title,
            subtitle: s.value || s.subtitle || base.subtitle
        };
    }) : defaultStats;

    return (
        <section className="relative z-30 px-6 -mt-10 mb-10 pointer-events-none">
            <div className="container mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl shadow-slate-900/5 flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-slate-100 overflow-hidden pointer-events-auto"
                >
                    {displayStats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="flex-1 w-full px-8 py-6 flex items-center justify-center sm:justify-start md:justify-center gap-6 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                            <div className="relative shrink-0">
                                {/* Classic Light Blue Offset Circle */}
                                <div className="w-12 h-12 rounded-full bg-[#EBF3FF] absolute -top-1 -left-2 transition-transform duration-500 group-hover:scale-110" />
                                
                                {/* White Icon Circle with Border */}
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center relative z-10 text-slate-800 shadow-sm group-hover:border-primary/30 transition-colors">
                                    <stat.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-[17px] font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                                    {stat.title}
                                </h3>
                                <p className="text-[13px] font-medium text-slate-500">
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
