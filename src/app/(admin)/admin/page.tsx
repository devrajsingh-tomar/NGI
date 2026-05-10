import { getDashboardStats } from "@/app/actions/dashboard";
import {
    Users,
    BookOpen,
    Wallet,
    AlertCircle,
    TrendingUp,
    ShieldAlert,
    Award,
    ChevronRight,
    BrainCircuit,
    Trophy,
    ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const res = await getDashboardStats();

    // Fallback if DB fetch fails
    const s = res.success ? (res.stats as any) : {
        totalStudents: 0,
        activeCourses: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
        recentAttempts: [],
        recentStudents: []
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 relative">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Admin <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                        System fully operational • Real-time metrics
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/mock-tests/list">
                        <Button variant="outline" className="h-12 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold px-6 text-slate-700 shadow-sm transition-all">
                            View All Tasks
                        </Button>
                    </Link>
                    <Link href="/admin/mock-tests/new">
                        <Button className="h-12 px-8 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 rounded-xl transition-all border-none font-semibold">
                            New Assessment
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <MetricCard
                    label="Active Students"
                    value={s.totalStudents}
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                    trend="+12%"
                    color="blue"
                />
                <MetricCard
                    label="Published Courses"
                    value={s.activeCourses}
                    icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
                    trend="Stable"
                    color="indigo"
                />
                <MetricCard
                    label="Total Revenue"
                    value={`₹${s.totalRevenue.toLocaleString()}`}
                    icon={<Wallet className="w-6 h-6 text-emerald-600" />}
                    trend="+18%"
                    color="emerald"
                />
                <MetricCard
                    label="Pending Actions"
                    value={s.pendingApprovals}
                    icon={<AlertCircle className="w-6 h-6 text-rose-600" />}
                    trend="Needs Review"
                    color="rose"
                    alert={true}
                />
            </div>

            {/* Premium Assessment Hub Widget */}
            <div className="relative group z-10">
                <div className="relative bg-white rounded-[2rem] p-1 shadow-sm overflow-hidden border border-slate-200">
                    <div className="bg-orange-50/30 rounded-[1.8rem] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-orange-100/50 to-transparent -skew-x-12 translate-x-1/2 opacity-50" />
                        
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-orange-200">
                                    <BrainCircuit className="w-4 h-4" /> Intelligence Hub
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Mock Test <span className="text-primary">Performance.</span>
                                </h2>
                                <p className="text-slate-600 font-medium max-w-md leading-relaxed">System-wide diagnostic metrics and student growth analytics portal.</p>
                            </div>
                            <Link href="/admin/results">
                                <Button className="h-16 px-10 rounded-2xl gap-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm group/btn transition-all duration-300 font-semibold">
                                    Global Analytics <TrendingUp className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 relative z-10 border-t border-slate-200/60 pt-10">
                            <StatItem label="Exams Conducted" value={s.mockMetrics?.totalTests || 0} icon={<Award className="w-6 h-6 text-primary" />} />
                            <StatItem label="Global Attempts" value={s.mockMetrics?.totalAttempts || 0} icon={<Users className="w-6 h-6 text-blue-500" />} />
                            <StatItem label="Zenith Score" value={s.mockMetrics?.highestScore || 0} icon={<Trophy className="w-6 h-6 text-emerald-500" />} unit="pts" />
                            <StatItem label="Performance Mean" value={s.mockMetrics?.avgScore || 0} icon={<TrendingUp className="w-6 h-6 text-orange-500" />} unit="%" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Global Live Feed */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col h-[600px]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Submissions</h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">Global Activity Stream</p>
                        </div>
                        <Link href="/admin/results"><Button variant="ghost" className="font-semibold gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50">View History <ChevronRight className="w-4 h-4" /></Button></Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                        {s.recentAttempts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-semibold text-sm">Awaiting Activity</p>
                            </div>
                        ) : (
                            s.recentAttempts.map((attempt: any) => (
                                <div key={attempt._id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-primary text-lg border border-orange-100 group-hover:bg-primary group-hover:text-white transition-all">
                                            {attempt.studentId?.name?.charAt(0) || "S"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-base">{attempt.studentId?.name || "Anonymous"}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium text-slate-500 truncate max-w-[150px]">
                                                    {attempt.quizId?.title}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <time className="text-xs text-slate-400">Just now</time>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`px-3 py-1 rounded-lg text-sm font-semibold border ${attempt.isPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                            {attempt.totalScore} / {attempt.totalMarks}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right panel - New Signups */}
                <div className="bg-primary rounded-[2rem] p-8 shadow-md text-white flex flex-col h-[600px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[60px]" />
                    
                    <div className="mb-8 relative z-10">
                        <h2 className="text-xl font-bold tracking-tight">New Members</h2>
                        <p className="text-white/80 font-medium text-sm mt-1">Recently Registered Students</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 relative z-10 scrollbar-hide">
                        {s.recentStudents.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/50">
                                <p className="font-medium text-sm">Ghost Town</p>
                            </div>
                        ) : (
                            s.recentStudents.map((u: any) => (
                                <div key={u._id} className="bg-black/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-black/20 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white border border-white/20">
                                        {u.name?.charAt(0) || "S"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-white truncate text-sm">{u.name}</p>
                                        <p className="text-xs font-medium text-white/70 truncate mt-0.5">{u.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link href="/admin/students" className="mt-6 relative z-10">
                        <Button className="w-full bg-white text-primary hover:bg-slate-50 font-bold h-14 rounded-xl shadow-sm transition-all border-none">
                            User Directory
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, alert, color }: any) {
    const variants: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <div className={cn(
            "p-6 rounded-[1.5rem] border bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group",
            alert ? "border-rose-200 bg-rose-50/30" : "border-slate-200"
        )}>
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-transform group-hover:scale-105 duration-300",
                variants[color] || "bg-slate-50 border-slate-100 text-slate-600"
            )}>
                {icon}
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <div className="mt-4 flex items-center gap-2">
                <span className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium",
                    alert ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                )}>
                    {trend}
                </span>
                {!alert && <TrendingUp className="w-4 h-4 text-emerald-500" />}
            </div>
        </div>
    );
}

function StatItem({ label, value, icon, unit }: any) {
    return (
        <div className="space-y-2 group/stat">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200 group-hover/stat:bg-primary group-hover/stat:text-white transition-all">
                    {icon}
                </div>
                <p className="text-xs font-semibold text-slate-600">{label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                {value}
                {unit && <span className="text-sm font-medium text-slate-500 tracking-normal">{unit}</span>}
            </p>
        </div>
    );
}
