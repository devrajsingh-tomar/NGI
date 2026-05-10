"use client";

import { useState } from "react";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function CertificateVerificationSection() {
    const [certNumber, setCertNumber] = useState("");
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (certNumber.trim()) {
            router.push(`/verify/${encodeURIComponent(certNumber.trim())}`);
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 mix-blend-multiply" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-[60px]" />

            <div className="container px-6 mx-auto relative z-10 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 font-bold mb-8 border border-emerald-100 shadow-sm text-xs tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" /> Official Credential Registry
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Verify Academic Certificate
                </h2>
                
                <p className="text-lg text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                    Enter the certificate identifier to authenticate academic achievements and validate digital credentials issued by NGI Study Zone Institute.
                </p>

                <form onSubmit={handleVerify} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <Search className="w-6 h-6" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Enter Certificate Number (e.g. NGI Study Zone/2026/001)"
                            value={certNumber}
                            onChange={(e) => setCertNumber(e.target.value)}
                            className="bg-white border-2 border-slate-200 text-slate-900 text-lg rounded-2xl pl-16 pr-6 h-16 w-full shadow-lg shadow-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={!certNumber.trim()}
                        className="h-16 px-10 rounded-2xl text-lg font-black bg-slate-900 text-white hover:bg-primary transition-all hover:scale-105 shadow-xl shadow-slate-200 shrink-0 group w-full md:w-auto"
                    >
                        Verify Now
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>
                
                <div className="mt-10 flex flex-wrap justify-center items-center gap-6 opacity-60 grayscale text-slate-500">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Tamper Proof
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <Search className="w-4 h-4" /> Instant Validation
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <ArrowRight className="w-4 h-4" /> Global Access
                    </div>
                </div>
            </div>
        </section>
    );
}
