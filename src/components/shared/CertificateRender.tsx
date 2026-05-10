import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface CertificateRenderProps {
    studentName: string;
    courseName: string;
    issuedDate: string;
    certificateNumber: string;
    grade: string;
    duration: string;
    percentage: number;
}

export default function CertificateRender({
    studentName, courseName, issuedDate, certificateNumber, grade, duration, percentage
}: CertificateRenderProps) {

    // We render this div as an A4 aspect ratio (1.414:1 or similar, e.g. 11/8.5 for US letter).
    // Let's use 1.414 aspect ratio landscape
    return (
        <div className="w-full max-w-5xl mx-auto aspect-[1.414/1] bg-white relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 print:p-0 print:w-full print:h-screen print:max-w-none print:m-0 print:aspect-auto print:bg-white shadow-2xl print:shadow-none bg-gradient-to-br from-slate-50 to-slate-100 border-[16px] border-double border-indigo-900 rounded-3xl print:rounded-none">

            {/* Corner Decorative Patterns */}
            <div className="absolute top-0 left-0 w-32 h-32 border-r-4 border-b-4 border-amber-500 rounded-br-[4rem] opacity-20" />
            <div className="absolute top-0 right-0 w-32 h-32 border-l-4 border-b-4 border-amber-500 rounded-bl-[4rem] opacity-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-r-4 border-t-4 border-amber-500 rounded-tr-[4rem] opacity-20" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-l-4 border-t-4 border-amber-500 rounded-tl-[4rem] opacity-20" />

            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="bg-indigo-900 text-white px-6 py-2 rounded-b-2xl shadow-xl flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold tracking-widest uppercase text-xs">A Premium Quality Certification</span>
                </div>
            </div>

            {/* Central Seal Background (Watermark) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-[40rem] h-[40rem] text-indigo-900" />
            </div>

            {/* Header Content */}
            <div className="text-center space-y-4 relative z-10 w-full max-w-3xl mt-12">
                <h1 className="text-4xl md:text-6xl font-black text-indigo-900 tracking-tighter uppercase font-serif" style={{ fontFamily: "Georgia, serif" }}>
                    Certificate of Excellence
                </h1>
                <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mt-4">
                    This prestigious document proudly verifies the achievement of
                </p>
            </div>

            {/* Student Name */}
            <div className="mt-8 mb-8 border-b border-indigo-200 pb-2 px-12 relative z-10 text-center w-full max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
                    {studentName}
                </h2>
            </div>

            {/* Body Description */}
            <div className="text-center space-y-2 relative z-10 max-w-2xl text-slate-600 font-medium">
                <p className="text-lg">
                    Has successfully complete the intensive curriculum and satisfied all rigorous academic requirements for:
                </p>
                <div className="bg-indigo-50/50 py-3 px-6 rounded-2xl border border-indigo-100 mt-4 mb-4 shadow-inner">
                    <h3 className="text-2xl font-black text-indigo-900 uppercase tracking-wide">
                        {courseName}
                    </h3>
                </div>
                <p className="text-sm">
                    A comprehensive course comprising <strong>{duration}</strong> of advanced technical instruction,
                    culminating with a final score of <span className="font-bold text-slate-900">{percentage}%</span> and achieving an overall tier grade of <span className="font-bold text-slate-900">{grade}</span>.
                </p>
            </div>

            {/* Footer / Signatures */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-10 mt-auto w-full max-w-4xl box-border px-8">
                {/* Issue Date & ID */}
                <div className="text-left space-y-1">
                    <p className="text-xs font-black uppercase text-indigo-900 tracking-widest">Date of Issue</p>
                    <p className="text-sm font-bold text-slate-700">{issuedDate}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-2">ID: {certificateNumber}</p>
                    <p className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold mt-1">
                        <CheckCircle2 className="w-3 h-3" /> Blockchain Secured
                    </p>
                </div>

                {/* Director Signature */}
                <div className="text-center space-y-1">
                    <div className="h-16 w-48 border-b-2 border-indigo-900 relative">
                        {/* Fake Signature Script */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl text-slate-900 font-bold opacity-80 select-none pointer-events-none transform -rotate-3" style={{ fontFamily: "cursive" }}>
                            Admin Signature
                        </div>
                    </div>
                    <p className="text-xs font-black uppercase text-indigo-900 tracking-widest pt-2">Program Director</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Authorized Signatory</p>
                </div>
            </div>
        </div>
    );
}
