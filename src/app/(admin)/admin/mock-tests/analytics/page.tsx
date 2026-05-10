"use client";

import { BarChart3, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MockTestAnalyticsPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-purple-100/50">
                <BarChart3 className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Advanced Analytics</h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto text-lg leading-relaxed mb-10">
                Visual data representations, growth charts, and student performance heatmaps are coming soon. 
                Everything you need to predict success based on mock test trends.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/mock-tests">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl font-black gap-2 border-2">
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Button>
                </Link>
                <Link href="/admin/results">
                    <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                        View Raw Results
                    </Button>
                </Link>
            </div>
        </div>
    );
}
