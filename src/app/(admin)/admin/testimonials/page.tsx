import { listAllTestimonials } from "@/app/actions/testimonials";
import { Star, MessageSquare, Eye, EyeOff, Award } from "lucide-react";
import TestimonialsAdminClient from "./TestimonialsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
    const res = await listAllTestimonials({ page: 1, limit: 100 });
    const { testimonials, total } = res.success
        ? res.data
        : { testimonials: [], total: 0 };

    const published = testimonials.filter((t: any) => t.status === "published").length;
    const pending = testimonials.filter((t: any) => t.status === "draft").length;
    const archived = testimonials.filter((t: any) => t.status === "archived").length;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-16 h-16 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Student Testimonials
                        </h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Total Reviews: <span className="text-slate-900">{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Total", val: total, icon: MessageSquare, color: "text-primary" },
                    { label: "Published", val: published, icon: Eye, color: "text-emerald-500" },
                    { label: "Pending Approval", val: pending, icon: Award, color: "text-amber-500" },
                    { label: "Archived", val: archived, icon: EyeOff, color: "text-slate-400" },
                ].map(({ label, val, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="text-2xl font-black text-slate-900">{val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Panel */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10">
                <TestimonialsAdminClient testimonials={testimonials} total={total} />
            </div>
        </div>
    );
}
