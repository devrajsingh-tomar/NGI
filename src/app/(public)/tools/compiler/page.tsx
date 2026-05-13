import CodeCompiler from "@/components/public/tools/CodeCompiler";
import { Sparkles } from "lucide-react";
import Head from "next/head";

export const metadata = {
    title: "Online Code Compiler | NGI Study Zone",
    description: "Practice coding in C, C++, Java, Python, and more with our high-speed online compiler.",
};

export default function CodeCompilerPage() {
    return (
        <div className="min-h-screen bg-white pt-40 pb-20">
            <Head>
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';" />
            </Head>
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
                        Master your programming skills in a high-tech environment. Write, compile, and execute code in professional programming languages.
                    </p>
                </div>

                {/* Compiler Component */}
                <CodeCompiler />

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
