"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { submitAttendance } from "@/app/actions/attendance";
import { CheckCircle2, XCircle, Loader2, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");

    const [status, setStatus] = useState<"loading" | "locating" | "submitting" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!code) {
            setStatus("error");
            setMessage("Invalid link — no attendance code found.");
            return;
        }
        setStatus("locating");
        if (!navigator.geolocation) {
            handleSubmit(code, 0, 0);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handleSubmit(code, pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus("error");
                    setMessage("Location access denied. Please enable location permissions in your browser to verify attendance.");
                } else {
                    // Attempt without location or fallback gracefully
                    handleSubmit(code, 0, 0);
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, [code]);

    const handleSubmit = async (code: string, lat: number, lng: number, accuracy?: number) => {
        setStatus("submitting");
        const res = await submitAttendance(code, lat, lng, accuracy);
        if (res.success) {
            setStatus("success");
            setMessage("Your attendance has been marked successfully!");
            setTimeout(() => router.push("/student/attendance"), 3000);
        } else {
            setStatus("error");
            setMessage(res.error || "Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
                    {(status === "loading" || status === "locating") && (
                        <>
                            <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-10 h-10 text-indigo-400 animate-bounce" />
                            </div>
                            <h1 className="text-2xl font-black text-white mb-3">Getting Your Location</h1>
                            <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
                                Please allow location access for attendance verification.
                            </p>
                        </>
                    )}

                    {status === "submitting" && (
                        <>
                            <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-black text-white mb-3">Marking Attendance...</h1>
                            <p className="text-slate-400 font-medium text-sm">Verifying your code and location</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h1 className="text-2xl font-black text-white mb-3">Attendance Marked! ✅</h1>
                            <p className="text-emerald-400 font-bold text-sm mb-2">{message}</p>
                            <p className="text-slate-500 text-xs font-medium">Redirecting to your portal...</p>
                            <div className="mt-8 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Marked at</p>
                                <p className="text-white font-black text-sm mt-0.5">
                                    {new Date().toLocaleString("en-IN", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-500/20">
                                <XCircle className="w-10 h-10 text-rose-400" />
                            </div>
                            <h1 className="text-2xl font-black text-white mb-3">Verification Failed</h1>
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 mb-8">
                                <p className="text-rose-400 font-bold text-sm">{message}</p>
                            </div>
                            <div className="space-y-3">
                                <Link href="/student/attendance">
                                    <Button className="w-full h-12 rounded-xl font-bold gap-2 bg-white text-slate-900 hover:bg-slate-100">
                                        <ArrowLeft className="w-4 h-4" /> Go Back & Try Again
                                    </Button>
                                </Link>
                                <Link href="/student">
                                    <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/10">
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <p className="text-slate-600 text-center text-xs font-bold mt-6 tracking-widest uppercase">
                    NGI Study Zone Institute · Smart Attendance System
                </p>
            </div>
        </div>
    );
}
