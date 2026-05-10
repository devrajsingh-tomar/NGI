"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { submitAttendance } from "@/app/actions/attendance";
import {
    QrCode,
    Camera,
    CheckCircle2,
    XCircle,
    Loader2,
    MapPin,
    Clock,
    ShieldCheck,
    Keyboard,
    RefreshCw,
    CalendarCheck,
    TrendingUp,
    Info,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

type ScanState = "idle" | "scanning" | "processing" | "success" | "error";

export default function StudentAttendancePage() {
    const { data: session } = useSession();
    const [scanState, setScanState] = useState<ScanState>("idle");
    const [mode, setMode] = useState<"qr" | "manual">("qr");
    const [manualCode, setManualCode] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
    const [locLoading, setLocLoading] = useState(false);
    const [locError, setLocError] = useState("");
    const [scannerReady, setScannerReady] = useState(false);
    const [cameraPermission, setCameraPermission] = useState<"unknown" | "granted" | "denied">("unknown");
    const [submitting, setSubmitting] = useState(false);

    const scannerRef = useRef<any>(null);
    const html5QrRef = useRef<any>(null);

    // On mount, get location proactively
    useEffect(() => {
        getLocation();
        return () => {
            stopScanner();
        };
    }, []);

    const getLocation = useCallback(() => {
        setLocLoading(true);
        setLocError("");
        if (!navigator.geolocation) {
            setLocError("Geolocation not supported by your browser.");
            setLocLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                });
                setLocLoading(false);
            },
            (err) => {
                setLocError("Location access denied. Attendance may not be processed.");
                setLocLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const startScanner = useCallback(async () => {
        setScanState("scanning");
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            html5QrRef.current = new Html5Qrcode("qr-reader");
            await html5QrRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText: string) => {
                    await stopScanner();
                    await handleQRResult(decodedText);
                },
                () => {} // ignore errors during scan
            );
            setCameraPermission("granted");
            setScannerReady(true);
        } catch (err: any) {
            if (err?.message?.includes("Permission")) {
                setCameraPermission("denied");
                toast.error("Camera permission denied. Use manual code entry.");
            } else {
                toast.error("Camera failed to start.");
            }
            setScanState("idle");
        }
    }, [location]);

    const stopScanner = async () => {
        if (html5QrRef.current) {
            try {
                await html5QrRef.current.stop();
                html5QrRef.current.clear();
            } catch (_) {}
            html5QrRef.current = null;
        }
        setScannerReady(false);
    };

    const handleQRResult = async (url: string) => {
        // Extract code from URL like /student/attendance/verify?code=XXXX
        let code = url;
        try {
            const parsed = new URL(url);
            const paramCode = parsed.searchParams.get("code");
            if (paramCode) code = paramCode;
        } catch (_) {
            // Not a full URL, treat as raw code
        }
        await processCode(code);
    };

    const processCode = async (code: string) => {
        setScanState("processing");
        setResultMessage("");

        if (!code.trim()) {
            setScanState("error");
            setResultMessage("Please enter a valid attendance code.");
            return;
        }

        const res = await submitAttendance(
            code.trim(),
            location?.lat ?? 0,
            location?.lng ?? 0,
            location?.accuracy
        );

        if (res.success) {
            setScanState("success");
            setResultMessage("Attendance marked successfully! ✅");
            toast.success("Attendance marked!");
        } else {
            setScanState("error");
            setResultMessage(res.error || "Failed to mark attendance.");
            toast.error(res.error || "Failed.");
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await processCode(manualCode);
        setSubmitting(false);
    };

    const reset = async () => {
        await stopScanner();
        setScanState("idle");
        setManualCode("");
        setResultMessage("");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <CalendarCheck className="w-5 h-5 text-white" />
                    </div>
                    Mark Attendance
                </h1>
                <p className="text-slate-500 font-medium mt-2 text-sm">
                    Scan the QR code displayed by your instructor or enter the attendance code manually.
                </p>
            </div>

            {/* Location Status Bar */}
            <div className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-bold",
                locLoading ? "bg-amber-50 border-amber-200 text-amber-700" :
                location ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                "bg-rose-50 border-rose-200 text-rose-600"
            )}>
                {locLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : location ? (
                    <MapPin className="w-4 h-4" />
                ) : (
                    <XCircle className="w-4 h-4" />
                )}
                <span className="flex-1">
                    {locLoading ? "Detecting your location..." :
                     location ? `Location verified (±${Math.round(location.accuracy ?? 0)}m accuracy)` :
                     locError || "Location unavailable"}
                </span>
                {!locLoading && !location && (
                    <button onClick={getLocation} className="underline font-black text-xs">Retry</button>
                )}
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                {/* Tab switcher */}
                {(scanState === "idle" || scanState === "scanning") && (
                    <div className="flex border-b">
                        <button
                            onClick={async () => { await stopScanner(); setMode("qr"); setScanState("idle"); }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-5 font-black text-sm uppercase tracking-widest transition-all",
                                mode === "qr"
                                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Camera className="w-4 h-4" />
                            Scan QR Code
                        </button>
                        <button
                            onClick={async () => { await stopScanner(); setMode("manual"); setScanState("idle"); }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-5 font-black text-sm uppercase tracking-widest transition-all",
                                mode === "manual"
                                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Keyboard className="w-4 h-4" />
                            Enter Code
                        </button>
                    </div>
                )}

                <div className="p-8 md:p-10">
                    {/* SUCCESS STATE */}
                    {scanState === "success" && (
                        <div className="flex flex-col items-center text-center py-8 animate-in zoom-in">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">You're Marked Present!</h2>
                            <p className="text-slate-500 font-medium mt-2 max-w-xs">{resultMessage}</p>
                            <div className="mt-2 px-4 py-2 bg-emerald-50 rounded-full">
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                                    {new Date().toLocaleString("en-IN", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                            <Button onClick={reset} variant="outline" className="mt-8 rounded-xl font-bold gap-2 h-12">
                                <RefreshCw className="w-4 h-4" /> Mark Another
                            </Button>
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {scanState === "error" && (
                        <div className="flex flex-col items-center text-center py-8 animate-in zoom-in">
                            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-100">
                                <XCircle className="w-12 h-12 text-rose-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Could Not Mark</h2>
                            <p className="text-rose-500 font-bold mt-2 max-w-sm">{resultMessage}</p>
                            <Button onClick={reset} variant="outline" className="mt-8 rounded-xl font-bold gap-2 h-12">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </Button>
                        </div>
                    )}

                    {/* PROCESSING STATE */}
                    {scanState === "processing" && (
                        <div className="flex flex-col items-center text-center py-16 animate-in fade-in">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Verifying Attendance...</h2>
                            <p className="text-slate-400 font-medium mt-2 text-sm">Checking your code and location</p>
                        </div>
                    )}

                    {/* QR SCAN MODE */}
                    {(scanState === "idle" || scanState === "scanning") && mode === "qr" && (
                        <div className="flex flex-col items-center gap-6">
                            {/* QR Viewfinder Area */}
                            <div className={cn(
                                "relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-4 transition-all",
                                scanState === "scanning" ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-dashed border-slate-300 bg-slate-50"
                            )}>
                                {/* html5-qrcode mounts INTO this div */}
                                <div id="qr-reader" className="w-full h-full" />

                                {/* Overlay when idle */}
                                {scanState === "idle" && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
                                        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                            <QrCode className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 text-center">Camera will appear here</p>
                                    </div>
                                )}

                                {/* Animated corners */}
                                {scanState === "scanning" && (
                                    <>
                                        <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl pointer-events-none" />
                                        <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl pointer-events-none" />
                                        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl pointer-events-none" />
                                        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl pointer-events-none" />
                                        {/* Scan line animation */}
                                        <div className="absolute left-6 right-6 h-0.5 bg-indigo-500/70 top-1/2 animate-bounce pointer-events-none shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]" />
                                    </>
                                )}
                            </div>

                            {scanState === "idle" ? (
                                <Button
                                    onClick={startScanner}
                                    className="w-full max-w-[320px] h-14 rounded-2xl font-bold text-base shadow-xl shadow-indigo-500/25 gap-3"
                                >
                                    <Camera className="w-5 h-5" />
                                    Open Camera & Scan
                                </Button>
                            ) : (
                                <div className="flex flex-col items-center gap-3 w-full max-w-[320px]">
                                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full font-bold text-sm">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                        Camera Active — Point at QR Code
                                    </div>
                                    <Button onClick={async () => { await stopScanner(); setScanState("idle"); }} variant="outline" className="w-full h-12 rounded-2xl font-bold gap-2 border-2">
                                        Stop Scanner
                                    </Button>
                                </div>
                            )}

                            {cameraPermission === "denied" && (
                                <div className="w-full max-w-[320px] bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-sm">
                                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-amber-800">Camera Blocked</p>
                                        <p className="text-amber-600 font-medium">Enable camera access in your browser settings, or use <button onClick={() => setMode("manual")} className="underline font-black">manual code entry</button>.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MANUAL CODE MODE */}
                    {(scanState === "idle") && mode === "manual" && (
                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Keyboard className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg">Enter Attendance Code</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Ask your instructor for today's code</p>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. 3F9A2B..."
                                    className="w-full h-16 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 text-center text-xl font-black text-slate-900 rounded-2xl outline-none tracking-[0.3em] transition-all placeholder:tracking-[0.1em] placeholder:text-slate-300 placeholder:font-normal"
                                    maxLength={64}
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={!manualCode.trim() || submitting}
                                className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-indigo-500/25 gap-3"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                                ) : (
                                    <><ShieldCheck className="w-5 h-5" /> Submit Attendance</>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
                <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-600" /> How It Works
                </h3>
                <ol className="space-y-4">
                    {[
                        { icon: QrCode, color: "bg-indigo-100 text-indigo-600", text: "Your instructor generates a QR code for today's class." },
                        { icon: Camera, color: "bg-purple-100 text-purple-600", text: "Scan it using your phone camera on this page." },
                        { icon: MapPin, color: "bg-emerald-100 text-emerald-600", text: "Your location is verified — you must be within 100m of the classroom." },
                        { icon: CheckCircle2, color: "bg-blue-100 text-blue-600", text: "Attendance is instantly marked in your portal." },
                    ].map((step, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="flex gap-3 items-center">
                                <span className="text-[10px] font-black text-slate-400 w-5 text-right shrink-0">{i + 1}</span>
                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", step.color)}>
                                    <step.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-600 pt-1.5">{step.text}</p>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Quick Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6">
                <h4 className="font-black text-amber-800 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Important Notes
                </h4>
                <ul className="space-y-2 text-sm font-medium text-amber-700 list-disc list-inside">
                    <li>QR codes expire after 5 minutes — scan quickly!</li>
                    <li>You must be within 100m of the classroom for verification.</li>
                    <li>Attendance can only be marked once per day per class.</li>
                    <li>Location services must be enabled on your device.</li>
                </ul>
            </div>
        </div>
    );
}
