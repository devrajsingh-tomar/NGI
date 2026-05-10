"use client";

import { useState, useEffect } from "react";
import { BrainCircuit, FileText, Users, Target, TrendingUp, Sparkles, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMockTestStats } from "@/app/actions/dashboard";

export default function MockTestDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getMockTestStats();
            if (res.success) {
                setData(res);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const stats = [
        { 
            label: "Total Questions", 
            value: data?.stats?.totalQuestions?.toLocaleString() || "0", 
            icon: BrainCircuit, 
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        { 
            label: "Active Mock Tests", 
            value: data?.stats?.totalQuizzes?.toLocaleString() || "0", 
            icon: FileText, 
            color: "text-purple-600", 
            bg: "bg-purple-50" 
        },
        { 
            label: "Total Attempts", 
            value: data?.stats?.totalAttempts?.toLocaleString() || "0", 
            icon: Users, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50" 
        },
        { 
            label: "Avg. Accuracy", 
            value: "68%", 
            icon: Target, 
            color: "text-amber-600", 
            bg: "bg-amber-50" 
        },
    ];

    const upcomingTests = [
        { title: "JEE Advanced Full Mock", course: "JEE Mains + Adv", date: "24 Mar 2026", duration: "180m" },
        { title: "NEET Biology Sectional", course: "NEET Crash Course", date: "26 Mar 2026", duration: "60m" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mock Test Manager</h1>
                    <p className="text-slate-500 mt-2 font-medium">Create, manage and analyze all assessment activities from one place.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/mock-tests/new">
                        <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                            <PlusCircle className="w-6 h-6" /> Create New Test
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label} 
                        className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all"
                    >
                        <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400">{stat.label}</p>
                        <p className="text-xl md:text-3xl font-black text-slate-900 mt-1">{loading ? "..." : stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Recent Activity / Modules */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 md:gap-3">
                                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-amber-500" />
                                Assessment Ecosystem
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {[
                                    { label: "Question Bank", desc: "Manage 5,000+ MCQs & Theory", href: "/admin/mock-tests/questions", icon: BrainCircuit },
                                    { label: "Mock Quizzes", desc: "Live exam papers & sets", href: "/admin/mock-tests/list", icon: FileText },
                                    { label: "Performance Results", desc: "View student scorecards", href: "/admin/results", icon: TrendingUp },
                                    { label: "Advanced Analytics", desc: "Growth patterns & data", href: "/admin/mock-tests/analytics", icon: Target },
                                ].map((module) => (
                                    <Link key={module.label} href={module.href}>
                                        <div className="p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg transition-all group/card">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-colors">
                                                <module.icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-slate-900">{module.label}</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">{module.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table Placeholder */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900">Upcoming Live Tests</h2>
                            <Button variant="ghost" className="font-bold gap-2 text-primary hover:bg-primary/5 rounded-xl">
                                View Full Schedule <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {upcomingTests.map((test) => (
                                <div key={test.title} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary shadow-sm shrink-0">
                                            {test.duration}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm md:text-base">{test.title}</h4>
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium">{test.course}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right border-t sm:border-none pt-3 sm:pt-0">
                                        <p className="font-black text-slate-900 text-sm md:text-base">{test.date}</p>
                                        <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-emerald-500">Starts 9:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions / Updates */}
                <div className="space-y-8">
                    <div className="bg-primary rounded-[3rem] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mb-16 -mr-16" />
                        <h3 className="text-xl font-black mb-6">Quick Publish</h3>
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Ready to announce results for the last Batch test? Use our quick publisher to alert all students.
                            </p>
                            <Link href="/admin/results">
                                <Button className="w-full h-14 rounded-[1.5rem] font-bold text-base mt-2 bg-white text-primary hover:bg-slate-50 border-none shadow-sm">
                                    Open Results Manager
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Recent Logs</h3>
                        <div className="space-y-6">
                            {data?.logs?.length > 0 ? data.logs.map((log: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 leading-tight truncate" dangerouslySetInnerHTML={{ __html: log.content?.en }} />
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Added in {log.subject}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No recent activity logged.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
