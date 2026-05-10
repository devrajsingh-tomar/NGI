"use client";

import { useState, useEffect } from "react";
import { 
    ChevronLeft, UploadCloud, FileSpreadsheet, Download, 
    AlertCircle, CheckCircle2, Loader2, Trash2, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllCourses } from "@/app/actions/courses";
import { processExcelUpload } from "@/app/actions/admin/bulk-upload";
import { cn } from "@/lib/utils";

export default function BulkUploadQuestionsPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const res = await getAllCourses();
        if (res.success) setCourses(res.courses);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedCourseId) return toast.error("Please select a Course");
        if (!file) return toast.error("Please select an Excel file");

        setIsUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("courseId", selectedCourseId);

        try {
            const res = await processExcelUpload(formData);
            if (res.success) {
                toast.success("Questions uploaded successfully!");
                setResult(res.details);
                setFile(null);
            } else {
                toast.error(res.error || "Upload failed");
                if (res.details) setResult(res.details);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        window.open("/api/admin/questions/template", "_blank");
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/mock-tests/questions">
                        <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bulk Upload Questions</h1>
                        <p className="text-sm font-medium text-slate-500">Import hundreds of questions instantly using Excel</p>
                    </div>
                </div>
                <Button onClick={downloadTemplate} variant="outline" className="h-12 gap-2 rounded-xl border-2 border-primary/20 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5">
                    <Download className="w-4 h-4" /> Download Template
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Upload Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-10">
                        {/* Course Selection */}
                        <div className="space-y-3">
                            <Label className="font-black text-slate-700 text-lg ml-1">Target Course</Label>
                            <select 
                                className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 appearance-none transition-all"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="">-- Select Destination Course --</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                            <p className="text-xs text-slate-400 font-medium ml-2">All questions in this file will be assigned to this course.</p>
                        </div>

                        {/* File Dropzone */}
                        <div className="space-y-3">
                            <Label className="font-black text-slate-700 text-lg ml-1">Upload Excel File</Label>
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "relative h-64 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden",
                                    isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300",
                                    file ? "border-emerald-500 bg-emerald-50/30" : ""
                                )}
                            >
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={handleFileChange}
                                />
                                
                                {file ? (
                                    <div className="space-y-4 animate-in zoom-in duration-300">
                                        <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                                            <FileSpreadsheet className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-lg truncate max-w-xs">{file.name}</h4>
                                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(2)} KB • Ready to Parse</p>
                                        </div>
                                        <Button variant="ghost" className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-black uppercase" onClick={(e) => { e.preventDefault(); setFile(null); }}>
                                            <Trash2 className="w-3 h-3 mr-1" /> Remove File
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-white text-slate-400 flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        <h4 className="font-black text-slate-900 text-lg mb-1">Drag and drop file here</h4>
                                        <p className="text-slate-500 font-medium">or click to browse your computer</p>
                                        <div className="mt-6 px-4 py-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Only .XLSX files supported
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <Button 
                            className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 gap-3 transition-all hover:scale-[1.01] active:scale-95"
                            disabled={!file || !selectedCourseId || isUploading}
                            onClick={handleUpload}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" /> Analyzing and Importing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-6 h-6 opacity-80" /> Start Bulk Import
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-primary" /> Important Guidelines
                        </h3>
                        <ul className="space-y-3 text-slate-400 font-medium text-sm list-disc pl-4">
                            <li>Ensure question types match the <code className="text-primary font-bold">type</code> column exactly (e.g. SINGLE_MCQ, TYPING).</li>
                            <li>For <code className="text-primary font-bold">MATCH</code>, provide pairs in JSON format: <code className="text-slate-300">{"{\"A\":\"1\", \"B\":\"2\"}"}</code>.</li>
                            <li>For <code className="text-primary font-bold">TYPING</code>, the passage goes in the <code className="text-primary font-bold">typing_passage</code> column.</li>
                            <li>Excel format must match the sample template perfectly to avoid parsing errors.</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Results / Stats */}
                <div className="space-y-6">
                    <div className="sticky top-10">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Import Summary</h3>
                        
                        {!result ? (
                            <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-10 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                                    <FileSpreadsheet className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-widest leading-loose">
                                    Waiting for file... <br/> results will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-right duration-500">
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-6 bg-emerald-500 text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Successfully Imported</p>
                                        <h2 className="text-4xl font-black">{result.successCount}</h2>
                                    </div>
                                    <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Failed Rows</p>
                                            <h4 className="text-xl font-black text-rose-500">{result.failedCount}</h4>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {result.errors.length > 0 && (
                                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Error Log</h4>
                                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black">{result.errors.length} Errors</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-3">
                                            {result.errors.map((err: any, idx: number) => (
                                                <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-rose-500 uppercase">Row {err.row}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700 leading-snug">{err.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.successCount > 0 && (
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-14 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 text-emerald-700 font-black"
                                        onClick={() => router.push("/admin/mock-tests/questions")}
                                    >
                                        View All Questions
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
