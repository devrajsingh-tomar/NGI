"use client";

import { CheckCircle2, AlertCircle, Info, ChevronDown, Sparkles, Target, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SEOAssistantProps {
    content: string;
    title: string;
    keyword: string;
    metaTitle: string;
    metaDesc: string;
}

export default function SEOAssistant({ 
    content, 
    title, 
    keyword, 
    metaTitle, 
    metaDesc 
}: SEOAssistantProps) {
    // Content cleaning for accurate word count
    const cleanContent = content.replace(/<[^>]*>?/gm, ' ');
    const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
    
    // SEO Checks
    const checks = [
        {
            title: "Add a Page Title",
            description: "Add a title to your blog post.",
            passed: !!title,
            priority: "high"
        },
        {
            title: "Focus Keyword in Title",
            description: "Include your focus keyword in the page title.",
            passed: keyword && title.toLowerCase().includes(keyword.toLowerCase()),
            priority: "high"
        },
        {
            title: "Add a Meta Description",
            description: "Compelling meta description for better CTR.",
            passed: !!metaDesc,
            priority: "high"
        },
        {
            title: "Focus Keyword in Content",
            description: "Your content should mention the focus keyword.",
            passed: keyword && cleanContent.toLowerCase().includes(keyword.toLowerCase()),
            priority: "medium"
        },
        {
            title: "Content Length",
            description: "At least 300 words recommended for SEO.",
            passed: wordCount >= 300,
            priority: "medium"
        },
        {
            title: "Title Length",
            description: "Keep title between 50-60 characters.",
            passed: title.length >= 50 && title.length <= 60,
            priority: "low"
        },
        {
            title: "Keyword in Slug",
            description: "The slug should contain the focus keyword.",
            passed: keyword && title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
            priority: "medium"
        }
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">SEO & Readability</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{passedCount}/{checks.length} passed</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-center flex-col text-center">
                <div className="relative w-32 h-32 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={364.42}
                            strokeDashoffset={364.42 - (score / 100) * 364.42}
                            className={cn(
                                "transition-all duration-1000 ease-out",
                                score > 70 ? "text-emerald-500" : score > 40 ? "text-amber-500" : "text-red-500"
                            )}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{score}</span>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            score > 70 ? "text-emerald-600" : "text-slate-400"
                        )}>SEO SCORE</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full px-2">
                    <StatBox label="Content" val={wordCount} icon={CheckCircle2} color="text-emerald-500" />
                    <StatBox label="Errors" val={checks.filter(c => !c.passed && c.priority === "high").length} icon={AlertCircle} color="text-red-500" />
                    <StatBox label="Warnings" val={checks.filter(c => !c.passed && c.priority !== "high").length} icon={Info} color="text-amber-500" />
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-1 h-5 rounded-full bg-primary" />
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">SEO Improvements</h4>
                    <span className="ml-auto bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full">{checks.filter(c => !c.passed).length}</span>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {checks.map((check, i) => (
                        <div key={i} className={cn(
                            "p-4 rounded-[1.5rem] border transition-all flex items-start gap-4",
                            check.passed 
                                ? "bg-emerald-50/30 border-emerald-100/50 grayscale opacity-60" 
                                : check.priority === 'high' ? "bg-red-50/30 border-red-100/50" : "bg-amber-50/30 border-amber-100/50"
                        )}>
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                check.passed 
                                    ? "bg-emerald-500 text-white" 
                                    : check.priority === 'high' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                            )}>
                                {check.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : check.priority === 'high' ? <AlertCircle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-900 leading-none">{check.title}</p>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{check.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-8 bg-slate-950 text-white">
                <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                          <Sparkles className="w-5 h-5" />
                     </div>
                     <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Guidance</p>
                          <p className="text-xs font-bold leading-tight">Focus on readability before technical SEO.</p>
                     </div>
                </div>
                <button className="w-full h-12 rounded-xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-colors">
                     Get Advanced Tips
                </button>
            </div>
        </div>
    );
}

function StatBox({ label, val, icon: Icon, color }: any) {
    return (
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col items-center">
            <Icon className={cn("w-3.5 h-3.5 mb-1.5", color)} />
            <p className="text-[10px] font-black text-slate-900 mb-0.5 tracking-tighter">{val}</p>
            <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
        </div>
    );
}
