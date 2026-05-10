"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { markSingleStudentAttendance } from "@/app/actions/attendance";
import { AttendanceStatus } from "@/types/attendance";
import { toast } from "sonner";
import { Loader2, UserCheck, UserX, Camera, RefreshCw } from "lucide-react";

interface AttendanceScannerProps {
    batchId: string;
    onSuccess?: () => void;
}

export default function AttendanceScanner({ batchId, onSuccess }: AttendanceScannerProps) {
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);
    const [lastScanned, setLastScanned] = useState<{name: string, ok: boolean} | null>(null);
    
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const startScanner = () => {
        if (!batchId) {
            toast.error("Please select a batch first!");
            return;
        }
        setScannerActive(true);
        
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "attendance-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }, 100);
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            scannerRef.current = null;
        }
        setScannerActive(false);
    };

    async function onScanSuccess(decodedText: string) {
        if (processing) return;
        
        // Typical Mongo ID is 24 chars. Validate if possible.
        if (decodedText.length < 12) {
             toast.error("Invalid QR code format.");
             return;
        }

        setProcessing(true);
        setScannedResult(decodedText);
        
        try {
            const res = await markSingleStudentAttendance(decodedText, AttendanceStatus.PRESENT, batchId);
            if (res.success) {
                toast.success("Attendance marked successfully!");
                setLastScanned({ name: decodedText.substring(decodedText.length - 8).toUpperCase(), ok: true });
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.error || "Failed to mark attendance.");
                setLastScanned({ name: "Unknown", ok: false });
            }
        } catch (err) {
            toast.error("An error occurred during scanning.");
        } finally {
            setProcessing(false);
            // Wait 2 seconds before allowing next scan to avoid duplicates
            setTimeout(() => {
                setScannedResult(null);
            }, 2000);
        }
    }

    function onScanFailure(error: any) {
        // quiet fail for continuous scanning
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error(err));
            }
        };
    }, []);

    return (
        <div className="space-y-6">
            {!scannerActive ? (
                <div 
                    onClick={startScanner}
                    className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <Camera className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Teacher QR Scanner</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2 text-sm">
                        Click to activate camera and scan student identity cards for instant entry.
                    </p>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden ring-4 ring-slate-800">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white animate-pulse">
                                 <div className="w-2 h-2 rounded-full bg-white" />
                             </div>
                             <span className="text-white font-black uppercase tracking-widest text-xs">Live Scanner Active</span>
                         </div>
                         <button 
                            onClick={stopScanner}
                            className="text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
                         >
                            Stop Session
                         </button>
                    </div>

                    <div id="attendance-reader" className="w-full overflow-hidden rounded-3xl bg-black/50 aspect-square mb-6" />

                    {processing && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-[2.5rem]">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-white font-black tracking-tight text-lg">Processing Attendance...</p>
                        </div>
                    )}

                    {lastScanned && !processing && (
                        <div className={`mt-4 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-2 ${lastScanned.ok ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lastScanned.ok ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                                 {lastScanned.ok ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                             </div>
                             <div>
                                 <p className="font-black text-sm">{lastScanned.ok ? "Success!" : "Scan Failed"}</p>
                                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest">ID: {lastScanned.name}</p>
                             </div>
                             <button onClick={() => setLastScanned(null)} className="ml-auto text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100">Dismiss</button>
                        </div>
                    )}

                    <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-6">
                        Place Student QR within frame
                    </p>
                </div>
            )}
        </div>
    );
}
