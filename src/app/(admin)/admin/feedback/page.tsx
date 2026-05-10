
import { listAllFeedback } from "@/app/actions/feedback";
import { Video, Star, Eye, EyeOff, TrendingUp } from "lucide-react";
import FeedbackAdminClient from "./FeedbackAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
    const res = await listAllFeedback({ page: 1, limit: 50 });
    const { feedbacks, total } = res.success
        ? res.data
        : { feedbacks: [], total: 0 };

    const active = feedbacks.filter((f: any) => f.isActive).length;
    const hidden = feedbacks.filter((f: any) => !f.isActive).length;
    const avgRating =
        feedbacks.filter((f: any) => f.rating).length > 0
            ? (
                feedbacks
                    .filter((f: any) => f.rating)
                    .reduce((a: number, f: any) => a + f.rating, 0) /
                feedbacks.filter((f: any) => f.rating).length
            ).toFixed(1)
            : "—";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-16 h-16 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                        <Video className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Video Testimonials
                        </h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Total: <span className="text-slate-900">{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Total", val: total, icon: Video, color: "text-primary" },
                    { label: "Active", val: active, icon: Eye, color: "text-emerald-500" },
                    { label: "Hidden", val: hidden, icon: EyeOff, color: "text-amber-500" },
                    { label: "Avg Rating", val: avgRating, icon: Star, color: "text-amber-400" },
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
                <FeedbackAdminClient feedbacks={feedbacks} total={total} />
            </div>
        </div>
    );
}
