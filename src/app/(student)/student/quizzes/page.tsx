"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { getAvailableQuizzes } from "@/app/actions/student/quizzes";
import { submitTestRequest } from "@/app/actions/paidTestRequests";
import { 
    Trophy, 
    Clock, 
    Target, 
    Sparkles, 
    ExternalLink, 
    Lock, 
    Unlock, 
    Coins, 
    CheckCircle2, 
    AlertCircle,
    Loader2,
    Calendar,
    ChevronRight,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState<string | null>(null);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        setLoading(true);
        const res = await getAvailableQuizzes({});
        if (res.success) {
            setQuizzes(res.data);
        } else {
            toast.error(res.error || "Failed to load tests");
        }
        setLoading(false);
    };

    const handleRequestAccess = async (quiz: any) => {
        const transactionId = prompt(`Requesting access for ${quiz.title}. Price: ₹${quiz.pricing?.amount}. Please enter payment transaction ID:`);
        if (!transactionId) return;

        setRequesting(quiz._id);
        const res = await submitTestRequest(quiz._id, quiz.pricing.amount, "Manual / Transfer", transactionId);
        if (res.success) {
            toast.success("Access request submitted. Admin will verify shortly.");
            loadQuizzes();
        } else {
            toast.error(res.error);
        }
        setRequesting(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Synchronizing Assessment Hub...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 p-2 max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Trophy className="w-10 h-10 text-amber-500" />
                        My Mock Assessments
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Track your progress and attempt scheduled test series.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming Tests</p>
                        <p className="text-lg font-black text-slate-900">{quizzes.length} Active</p>
                    </div>
                    <Link href="/results">
                         <Button variant="outline" className="rounded-2xl h-14 font-black gap-2 border-slate-100 hover:bg-slate-50 shadow-sm">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Global Leaderboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quiz grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {quizzes.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[3rem] py-32 text-center border border-slate-100 shadow-xl">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-slate-200" />
                         </div>
                         <h2 className="text-2xl font-black text-slate-900">No Tests Scheduled</h2>
                         <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
                            Your course coordinator hasn't published any mock tests for your batches yet.
                         </p>
                    </div>
                ) : (
                    quizzes.map((quiz) => {
                        const isPaid = quiz.pricing?.type === "PAID";
                        const requestStatus = quiz.accessRequest?.status;
                        const hasAccess = !isPaid || requestStatus === "APPROVED";
                        const isPending = requestStatus === "PENDING";

                        return (
                            <div
                                key={quiz._id}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Background Decorative Element */}
                                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 transition-all duration-700 ${
                                    isPaid ? "bg-emerald-500/5 group-hover:bg-emerald-500/10" : "bg-primary/5 group-hover:bg-primary/10"
                                }`} />

                                <div className="flex-1 relative z-10 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${isPaid ? "bg-emerald-500 text-white" : "bg-primary text-white"} border-none text-[9px] font-black uppercase tracking-widest px-3 py-1`}>
                                                    {isPaid ? `₹${quiz.pricing.amount}` : "Free Test"}
                                                </Badge>
                                                {isPending && <Badge className="bg-amber-500 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 animate-pulse">Pending Approval</Badge>}
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                                                {quiz.title}
                                            </h3>
                                        </div>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                            hasAccess ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" : "bg-slate-50 text-slate-300"
                                        }`}>
                                            {hasAccess ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                                        </div>
                                    </div>

                                    <p className="text-slate-400 font-medium text-sm line-clamp-2 mb-8 italic">
                                        {quiz.description || "Comprehensive mock assessment designed for final exam readiness."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                                                <p className="text-sm font-black text-slate-800">{quiz.settings?.timeLimit} Mins</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                                            <Target className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Marks</p>
                                                <p className="text-sm font-black text-slate-800">{quiz.settings?.totalMarks} Marks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-3">
                                    {hasAccess ? (
                                        <>
                                            <Link href={`/student/quizzes/${quiz._id}`} className="flex-2">
                                                <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                                    <Play className="w-4 h-4" /> Start Assessment
                                                </Button>
                                            </Link>
                                            <Link href={`/student/quizzes/${quiz._id}/analysis`} className="flex-1">
                                                <Button variant="ghost" className="h-14 w-full rounded-2xl font-black text-slate-400 hover:bg-slate-100 text-xs uppercase tracking-widest">
                                                    Analysis <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button 
                                            onClick={() => handleRequestAccess(quiz)}
                                            disabled={isPending || requesting === quiz._id}
                                            className={`w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-2xl ${isPending ? "bg-amber-100 text-amber-600 shadow-none border-2 border-amber-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"}`}
                                        >
                                            {requesting === quiz._id ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : isPending ? (
                                                <>
                                                    <Clock className="w-6 h-6" /> Access Pending Approval
                                                </>
                                            ) : (
                                                <>
                                                    <Coins className="w-6 h-6" /> Unlock Full Access (₹{quiz.pricing.amount})
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bottom Banner */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                 <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">
                             Performance Boost
                        </Badge>
                        <h2 className="text-4xl font-black tracking-tight leading-none">
                            Sharpen Your Skills <br /> With <span className="text-primary italic font-serif">Deep Analytics</span>
                        </h2>
                        <p className="text-slate-400 font-medium max-w-lg">
                            Every mock test you attempt generates a detailed performance map. Unlock your rank and percentile to compare against peers.
                        </p>
                    </div>
                    <Link href="/results">
                        <Button className="h-16 px-10 rounded-2xl font-black text-lg gap-3 bg-white text-slate-900 hover:bg-slate-100">
                             View My History <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                 </div>
            </div>
        </div>
    );
}
