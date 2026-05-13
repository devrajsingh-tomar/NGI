import React from "react";
import { Terminal, Cpu, Code2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Developer Tools | NGI Study Zone",
    description: "Access a suite of professional developer tools designed for students and coding enthusiasts.",
};

export default function ToolsLandingPage() {
    const tools = [
        {
            title: "Online Code Compiler",
            description: "Write, compile and run code in 40+ languages including C, C++, Java, and Python.",
            icon: Terminal,
            href: "/tools/compiler",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        // Future tools can be added here
    ];

    return (
        <div className="min-h-screen bg-white pt-40 pb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                            Student Toolbox
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                        Developer <span className="text-primary">Tools</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Empowering the next generation of developers with professional-grade tools for learning and practice.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tools.map((tool, i) => (
                        <Link 
                            key={i} 
                            href={tool.href}
                            className="group relative p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className={`w-16 h-16 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                <tool.icon className="w-8 h-8" />
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{tool.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                {tool.description}
                            </p>

                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                                <span>Launch Tool</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </div>

                            {/* Background Accent */}
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-slate-50 rounded-full -z-10 group-hover:bg-primary/5 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
