import React from "react";
import { Terminal, Code2, Cpu, Sparkles, Globe, Shield } from "lucide-react";

export const metadata = {
    title: "Online Code Compiler | NGI Study Zone",
    description: "Practice coding in C, C++, Java, Python, and more with our high-speed online compiler.",
};

export default function CodeCompilerPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                            Developer Sandbox
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                        Online <span className="text-primary">Code</span> Compiler
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Master your programming skills in a high-tech environment. Write, compile, and execute code in over 40+ programming languages.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
                    {[
                        { icon: Terminal, title: "Multi-Language", desc: "C, C++, Java, Python, JS & more" },
                        { icon: Cpu, title: "Fast Execution", desc: "Optimized server-side compilation" },
                        { icon: Shield, title: "Safe Sandbox", desc: "Secure environment for practice" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase text-sm">{feature.title}</h3>
                                <p className="text-xs text-slate-500 font-bold">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compiler Container */}
                <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[3rem] p-4 md:p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border-4 border-slate-800 relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-0 opacity-30" />
                    
                    <div className="relative z-10 w-full aspect-video md:h-[750px] rounded-[2rem] overflow-hidden bg-slate-950 border border-white/10 shadow-inner">
                        <iframe
                            frameBorder="0"
                            height="100%"
                            width="100%"
                            src="https://onecompiler.com/embed/"
                            title="NGI Online Compiler"
                            className="w-full h-full"
                        ></iframe>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span>System Online</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-2 text-white/40 font-bold text-xs uppercase tracking-widest">
                                <Globe className="w-3.5 h-3.5" />
                                <span>Global Access</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 font-black italic text-xs uppercase">
                            <Code2 className="w-4 h-4 text-primary" />
                            Powered by NGI Tech Engine
                        </div>
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="mt-20 max-w-4xl mx-auto bg-slate-50 rounded-[3rem] p-12 border border-slate-100 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Need Help?</h2>
                    <p className="text-slate-600 font-medium mb-10 leading-relaxed text-lg">
                        Our online compiler is designed for educational purposes. If you encounter any bugs or need specific language support, feel free to contact our technical team.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                            Community Forum
                        </button>
                        <button className="px-10 h-14 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-sm">
                            Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
