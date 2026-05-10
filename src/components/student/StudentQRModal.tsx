"use client";

import { QRCodeSVG } from "qrcode.react";
import {
    X,
    Download,
    Share2,
    Smartphone,
    ShieldCheck,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
}

export default function StudentQRModal({ isOpen, onClose, studentId, studentName }: StudentQRModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <header className="p-8 pb-0 flex justify-between items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                        <X className="w-6 h-6 text-slate-400" />
                    </Button>
                </header>

                <div className="p-8 pt-6 text-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Your Identity QR</h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Show this at the reception for instant attendance</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-white mb-4">
                            <QRCodeSVG
                                value={studentId}
                                size={180}
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                    src: "/favicon.ico",
                                    x: undefined,
                                    y: undefined,
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
                            />
                        </div>
                        <p className="font-black text-slate-900 tracking-tight">{studentName}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">NGI Study Zone ID: {studentId.substring(studentId.length - 8).toUpperCase()}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white gap-2 shadow-xl shadow-slate-900/20">
                            <Download className="w-4 h-4" /> Save to Phone
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 border-slate-100">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-4 text-left">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">
                            This QR is unique to you. Do not share it with others for proxy attendance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
