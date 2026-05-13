"use client";

import React, { useState } from "react";
import { 
    Code2, 
    Terminal, 
    Cpu, 
    Globe, 
    ShieldCheck, 
    ChevronDown,
    Layout,
    Eye,
    Zap,
    Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
    { id: "python", label: "Python", icon: "🐍" },
    { id: "javascript", label: "JavaScript", icon: "🟨" },
    { id: "java", label: "Java", icon: "☕" },
    { id: "cpp", label: "C++", icon: "🟦" },
    { id: "c", label: "C", icon: "⚙️" },
    { id: "html", label: "HTML/CSS", icon: "🌐" }
];

export default function CodeCompiler() {
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // OneCompiler Embed URL Generator
    const getEmbedUrl = (langId: string) => {
        const baseUrl = "https://onecompiler.com/embed/";
        return `${baseUrl}${langId === 'html' ? 'web' : langId}?hideLanguageSelection=true&theme=dark`;
    };

    return (
        <div className={cn(
            "flex flex-col gap-6 max-w-[1400px] mx-auto pb-20 transition-all duration-500",
            isFullscreen && "fixed inset-0 z-[9999] bg-white p-6 pb-6 overflow-auto"
        )}>
            {/* Header & Controls */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <select 
                            value={selectedLang.id}
                            onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0])}
                            className="w-full md:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-3.5 pr-10 md:pr-12 text-[12px] md:text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all hover:bg-white"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.icon} {lang.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Secure Sandbox v2.0</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="hidden md:flex items-center gap-2 px-6 h-12 rounded-xl bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                    >
                        <Maximize2 className="w-4 h-4" />
                        {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Compiler Surface */}
            <div className={cn(
                "relative bg-slate-900 rounded-[2.5rem] p-3 md:p-6 shadow-2xl border-4 border-slate-800 overflow-hidden transition-all duration-500",
                isFullscreen ? "h-[calc(100vh-160px)]" : "h-[600px] md:h-[800px]"
            )}>
                {/* Decorative Window Controls */}
                <div className="flex items-center justify-between mb-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">
                            NGI Tech Engine — {selectedLang.label} Environment
                        </span>
                    </div>
                    <Code2 className="w-5 h-5 text-slate-700" />
                </div>

                {/* The Integrated Compiler */}
                <div className="w-full h-[calc(100%-40px)] rounded-[1.5rem] overflow-hidden bg-slate-950 border border-white/5 relative group">
                    <iframe
                        frameBorder="0"
                        height="100%"
                        width="100%"
                        src={getEmbedUrl(selectedLang.id)}
                        title="NGI Online Compiler"
                        className="w-full h-full"
                    ></iframe>
                    
                    {/* Status Overlay */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-3 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted Sandbox</span>
                    </div>
                </div>
            </div>

            {/* Support Footer */}
            {!isFullscreen && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-6 px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <Globe className="w-4 h-4" />
                            <span>Global Cloud Runtime</span>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <Cpu className="w-4 h-4" />
                            <span>v2.1.0-stable</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-black italic text-[10px] uppercase">
                        <Terminal className="w-4 h-4" />
                        Student Practice Portal
                    </div>
                </div>
            )}
        </div>
    );
}
