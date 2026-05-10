"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, UploadCloud, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteQuestion, bulkInsertQuestions } from "@/app/actions/questions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default function QuestionBankClient({ initialQuestions, courses }: { initialQuestions: any[], courses: any[] }) {
    const [questions, setQuestions] = useState(initialQuestions);
    const [search, setSearch] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        courseId: courses[0]?._id || "",
        topic: "",
        type: "MCQ_SINGLE",
        difficulty: "MEDIUM",
        contentEn: "",
        contentHi: "",
        marks: 1,
        negativeMarks: 0,
        options: [
            { textEn: "", isCorrect: true },
            { textEn: "", isCorrect: false },
            { textEn: "", isCorrect: false },
            { textEn: "", isCorrect: false }
        ],
        explanationEn: ""
    });



    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await deleteQuestion(id);
        if (res.success) {
            toast.success("Question deleted");
            setQuestions(questions.filter(q => q._id !== id));
        } else {
            toast.error(res.error);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleBulkUpload = async () => {
        if (!uploadFile) return toast.error("Select a JSON file");

        try {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const parsed = JSON.parse(event.target?.result as string);
                    if (!Array.isArray(parsed)) throw new Error("JSON must be an array of questions.");

                    const res = await bulkInsertQuestions(parsed);
                    if (res.success) {
                        toast.success(`Inserted ${res.count} questions! Refresh page to see.`);
                    } else {
                        toast.error(res.error);
                    }
                } catch (e) {
                    toast.error("Invalid JSON format");
                }
            };
            reader.readAsText(uploadFile);
        } catch (e) {
            toast.error("File processing error");
        } finally {
            setIsUploading(false);
        }
    };

    const filtered = questions.filter(q => q.content.en.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search questions by text or topic..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/mock-tests/questions/new">
                        <Button className="bg-primary text-white gap-2"><Plus className="w-4 h-4" /> Add Question</Button>
                    </Link>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2"><UploadCloud className="w-4 h-4" /> Bulk Upload</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload Question JSON</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <p className="text-sm text-slate-500">
                                    Upload a properly structured JSON array representing questions. Must align with IQuestion schema.
                                </p>
                                <Input type="file" accept=".json" onChange={handleFileUpload} />
                                <Button className="w-full" disabled={!uploadFile || isUploading} onClick={handleBulkUpload}>
                                    {isUploading ? "Uploading..." : "Start Upload"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm divide-y">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No questions found.</div>
                ) : (
                    filtered.map((q) => (
                        <div key={q._id} className="p-4 hover:bg-slate-50 flex items-start gap-4 transition-colors">
                            <div className="flex-1">
                                <div className="flex gap-2 items-center mb-1">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">{q.topic}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border">{q.difficulty}</span>
                                    <span className="text-xs text-slate-400">Course: {q.courseId?.title || 'Unknown'}</span>
                                </div>
                                <p className="font-medium text-slate-900 line-clamp-2">{q.content?.en}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <span className="text-sm font-bold text-green-600">+{q.marks} Marks</span>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
