"use client";

import { useEffect, useState, useRef } from "react";
import {
    Calendar as CalendarIcon,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    QrCode,
    Play,
    StopCircle,
    MapPin,
    Loader2,
    Camera,
    List,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getStudentsForAttendance,
    getEnrolledStudentsForBatch,
    markAttendance,
    getAttendanceByDate,
    generateQRSession,
    getActiveSession,
    stopSession
} from "@/app/actions/attendance";
import { getAllCourses } from "@/app/actions/courses";
import { AttendanceStatus } from "@/types/attendance";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import AttendanceScanner from "@/components/attendance/AttendanceScanner"; // Added
import { Input } from "@/components/ui/input"; // Added

export default function AttendancePage() {
    // --- Common State ---
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"generate" | "scan" | "manual">("generate");
    const [hasMounted, setHasMounted] = useState(false);

    // --- Manual Registry State ---
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [date, setDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // --- Live Session State ---
    const [activeCode, setActiveCode] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [useLocation, setUseLocation] = useState(true);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locLoading, setLocLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial Load
    useEffect(() => {
        setHasMounted(true);
        setDate(new Date().toISOString().split('T')[0]);
        loadCourses();
        // Initial fetchData only if manual tab is active by default, or handle it in the specific tab's logic
        if (activeTab === "manual") {
            fetchData();
        }
    }, []);

    // Date or Course Change triggers fetch
    useEffect(() => {
        if (activeTab === "manual") {
            fetchData();
        }
    }, [date, selectedCourse, activeTab]);

    // Timer Logic
    useEffect(() => {
        if (activeCode && expiresAt) {
            timerRef.current = setInterval(() => {
                const now = new Date().getTime();
                const exp = new Date(expiresAt).getTime();
                const diff = Math.max(0, Math.floor((exp - now) / 1000));

                setTimeLeft(diff);

                if (diff <= 0) {
                    resetSession();
                }
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeCode, expiresAt]);

    // Check active session when course selected
    useEffect(() => {
        if (selectedCourse) {
            checkActiveSession(selectedCourse);
        } else {
            resetSession();
        }
    }, [selectedCourse]);

    const resetSession = () => {
        setActiveCode(null);
        setSessionId(null);
        setExpiresAt(null);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const loadCourses = async () => {
        const res = await getAllCourses();
        if (res.success) {
            setCourses(res.courses || []);
        }
        setLoading(false); // Set loading to false after courses are loaded
    };

    const checkActiveSession = async (batchId: string) => {
        try {
            const res = await getActiveSession(batchId);
            if (res.success && res.session) {
                const session = res.session;
                if (new Date(session.expiresAt) > new Date()) {
                    setActiveCode(session.code);
                    setSessionId(session._id);
                    setExpiresAt(session.expiresAt);
                } else {
                    resetSession();
                }
            } else {
                resetSession();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getCurrentLocation = () => {
        setLocLoading(true);
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported on this browser/connection (Needs HTTPS)");
            setLocLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                toast.success("Location captured!");
                setLocLoading(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                
                // Fallback for local testing if hardware doesn't provide GPS
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    toast.success("Dev Fallback: Using default location");
                    setLocation({ lat: 17.3850, lng: 78.4867 }); // Hyderabad fallback
                } else {
                    toast.error(`Error: ${error.message} (Are location settings enabled?)`);
                }
                setLocLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleGenerateQR = async () => {
        if (!selectedCourse) {
            toast.error("Select a batch first");
            return;
        }
        if (useLocation && !location) {
            toast.error("Capture location first or disable geofencing");
            return;
        }

        setGenerating(true);
        try {
            const res = await generateQRSession(
                selectedCourse,
                useLocation ? location?.lat : undefined,
                useLocation ? location?.lng : undefined
            );

            if (res.success && res.code && res.sessionId && res.expiresAt) {
                setActiveCode(res.code);
                setSessionId(res.sessionId);
                setExpiresAt(res.expiresAt);
                setTimeLeft(300);
                toast.success("QR Session Active!");
            } else {
                toast.error(res.error || "Failed");
            }
        } catch (err) {
            toast.error("Failed to generate");
        } finally {
            setGenerating(false);
        }
    };

    const handleStopSession = async () => {
        if (!sessionId) return;
        const res = await stopSession(sessionId);
        if (res.success) {
            resetSession();
            toast.success("Session Stopped");
        } else {
            toast.error("Failed to stop session");
        }
    };

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        if (!selectedCourse) {
            toast.error("Please select a batch for manual registry");
            setSaving(false);
            return;
        }
        const records = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
        }));
        const res = await markAttendance(records, date, selectedCourse);
        if (res.success) toast.success("Saved");
        else toast.error("Failed");
        setSaving(false);
    };

    const fetchData = async () => {
        setLoading(true);
        const [studentRes, attendanceRes] = await Promise.all([
            selectedCourse ? getEnrolledStudentsForBatch(selectedCourse) : getStudentsForAttendance(),
            getAttendanceByDate(date, selectedCourse)
        ]);
        if (studentRes.success) {
            setStudents(studentRes.students || []);
            const map: Record<string, AttendanceStatus> = {};
            (studentRes.students || []).forEach((s: any) => map[s._id] = AttendanceStatus.PRESENT);
            if (attendanceRes.success) {
                (attendanceRes.records || []).forEach((a: any) => map[a.studentId] = a.status);
            }
            setAttendance(map);
        }
        setLoading(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const qrUrl = activeCode && typeof window !== 'undefined'
        ? `${window.location.origin}/student/attendance/verify?code=${activeCode}`
        : "";

    if (!hasMounted) return null;

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto">
            {/* Batch Selector Header */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                     <div>
                         <h1 className="text-4xl font-black tracking-tight leading-none mb-4">Classroom Attendance</h1>
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             Manage multiple entry modes for your batches
                         </p>
                     </div>
                     <div className="w-full md:w-72">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Active Batch</label>
                         <select
                            className="h-14 w-full bg-white/10 border border-white/20 rounded-2xl px-4 font-black outline-none focus:border-primary text-white backdrop-blur-md"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            disabled={!!activeCode}
                        >
                            <option value="" className="text-slate-900">Select Batch</option>
                            {courses.map(c => <option key={c._id} value={c._id} className="text-slate-900">{c.title}</option>)}
                        </select>
                     </div>
                 </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[2rem] w-fit mx-auto shadow-inner border border-slate-200">
                {[
                    { id: "generate", label: "Smart QR", icon: QrCode },
                    { id: "scan", label: "Scanner (QR)", icon: Camera },
                    { id: "manual", label: "Manual Registry", icon: List },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.6rem] text-sm font-black transition-all ${
                            activeTab === tab.id 
                            ? "bg-white text-primary shadow-xl ring-1 ring-slate-200" 
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === "generate" && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        {/* LIVE QR SECTION */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-12">
                                <div className="flex-1 space-y-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Generate Session</h2>
                                        <p className="text-slate-500 font-medium max-w-sm">Students scan this code on their own devices to mark presence.</p>
                                    </div>

                                    <div className="space-y-8 max-w-md">
                                        {!activeCode ? (
                                            <>
                                                <div className="p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-black text-slate-900 text-sm">Geofencing</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            id="useLoc"
                                                            checked={useLocation}
                                                            onChange={(e) => setUseLocation(e.target.checked)}
                                                            className="w-6 h-6 accent-primary"
                                                        />
                                                    </div>
                                                    
                                                    {useLocation && (
                                                        <Button
                                                            onClick={getCurrentLocation}
                                                            variant="outline"
                                                            className={cn("w-full h-14 rounded-2xl font-black border-2 transition-all", location ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "hover:border-primary")}
                                                        >
                                                            {locLoading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2 w-4 h-4" />}
                                                            {location ? "Secure Location Locked" : "Set Class Location"}
                                                        </Button>
                                                    )}
                                                </div>

                                                <Button
                                                    onClick={handleGenerateQR}
                                                    disabled={generating || !selectedCourse || (useLocation && !location)}
                                                    className="h-16 w-full rounded-2xl font-black shadow-2xl shadow-primary/20 text-lg gap-3"
                                                >
                                                    {generating ? <Loader2 className="animate-spin" /> : <Play className="w-6 h-6" />} Start QR Session
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="p-8 rounded-[2rem] bg-slate-950 text-white space-y-4">
                                                     <div className="flex justify-between items-center">
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session Status</span>
                                                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                     </div>
                                                     <p className="text-2xl font-black tracking-tight">Active & Broadcasting</p>
                                                     <p className="text-sm font-medium text-slate-400">Batch: {courses.find(c => c._id === selectedCourse)?.title}</p>
                                                </div>
                                                <Button
                                                    onClick={handleStopSession}
                                                    variant="destructive"
                                                    className="h-16 w-full rounded-2xl font-black shadow-xl"
                                                >
                                                    <StopCircle className="mr-2 w-6 h-6" /> Terminate QR Session
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-12 rounded-[3.5rem] border-4 border-dashed border-slate-200 min-h-[450px] relative">
                                    {activeCode && qrUrl ? (
                                        <div className="text-center animate-in zoom-in slide-in-from-top-4 duration-700">
                                            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl inline-block mb-10 border-4 border-white ring-1 ring-slate-100">
                                                <QRCodeSVG value={qrUrl} size={280} level="H" />
                                            </div>
                                            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl border-2 border-slate-800">
                                                <div className="relative">
                                                    <Clock className="w-5 h-5 text-emerald-400" />
                                                    <div className="absolute inset-0 bg-emerald-400/20 blur-sm rounded-full" />
                                                </div>
                                                <span className="font-mono font-black text-2xl tabular-nums">{formatTime(timeLeft)}</span>
                                            </div>
                                            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl py-3 px-8 shadow-inner mt-4 w-fit mx-auto">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">Manual Entry Code</p>
                                                <p className="font-mono text-3xl font-black text-indigo-700 tracking-[0.2em]">{activeCode}</p>
                                            </div>
                                            <p className="text-slate-400 text-xs font-black mt-6 uppercase tracking-[0.25em]">Session Broadcaster</p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-300">
                                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                                <QrCode className="w-10 h-10 opacity-30" />
                                            </div>
                                            <p className="font-black uppercase tracking-widest text-sm">QR Awaiting Activation</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "scan" && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto py-10">
                        <AttendanceScanner 
                            batchId={selectedCourse} 
                            onSuccess={() => {
                                // optional reload
                            }} 
                        />
                    </div>
                )}

                {activeTab === "manual" && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        {/* MANUAL REGISTRY TABLE */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                            <div className="bg-slate-50 p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-b">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Manual Registry</h2>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Entry Date: {date}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input 
                                            placeholder="Search Students..." 
                                            className="h-12 w-64 pl-11 rounded-xl border-2 border-slate-200 focus:ring-primary font-bold"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                         <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                         <Input 
                                            type="date" 
                                            className="h-12 w-44 pl-11 rounded-xl border-2 border-slate-200 font-bold"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        disabled={saving || !selectedCourse} 
                                        onClick={handleSave} 
                                        className="h-12 px-8 rounded-xl font-black bg-primary text-white shadow-xl shadow-primary/10 gap-2"
                                    >
                                        {saving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-slate-50/50">
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">Attendance Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                            <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border group-hover:bg-white group-hover:text-primary transition-all">
                                                            {s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-lg leading-none mb-1">{s.name}</p>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className="flex justify-center gap-3">
                                                        {[
                                                            { s: AttendanceStatus.PRESENT, label: "Present", color: "text-emerald-500", bg: "bg-emerald-50" },
                                                            { s: AttendanceStatus.ABSENT, label: "Absent", color: "text-red-500", bg: "bg-red-50" },
                                                            { s: AttendanceStatus.LATE, label: "Late", color: "text-amber-500", bg: "bg-amber-50" }
                                                        ].map(st => (
                                                            <button
                                                                key={st.s}
                                                                onClick={() => handleStatusChange(s._id, st.s)}
                                                                className={cn(
                                                                    "px-6 py-2.5 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all ring-1 ring-inset",
                                                                    attendance[s._id] === st.s 
                                                                        ? `bg-slate-900 text-white shadow-xl scale-105 ring-slate-800` 
                                                                        : `bg-white text-slate-400 hover:bg-slate-50 ring-slate-100`
                                                                )}
                                                            >
                                                                {st.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={2} className="px-10 py-24 text-center">
                                                     <div className="space-y-4 opacity-40">
                                                         <Search className="w-12 h-12 mx-auto" />
                                                         <p className="font-black uppercase tracking-widest text-sm">No students found for this filter</p>
                                                     </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
