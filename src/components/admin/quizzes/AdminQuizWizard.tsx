"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CheckCircle2,
    Settings,
    ShieldAlert,
    ListChecks,
    Save,
    Search,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminQuiz } from "@/app/actions/admin-quizzes";

const STEPS = ["Basic", "Configuration", "Security", "Questions"];

export default function AdminQuizWizard({ courses, questionBank }: { courses: any[], questionBank: any[] }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<any>({
        title: "",
        courseId: courses[0]?._id || "",
        description: "",
        timeLimit: 30,
        totalMarks: 0,
        passingMarks: 0,
        shuffleQuestions: false,
        shuffleOptions: false,
        maxAttempts: 1,
        preventTabSwitch: false,
        requireFullscreen: false,
        trackIpDevice: true,
        selectedQuestions: []
    });

    const [search, setSearch] = useState("");

    const toggleQuestion = (qId: string, qMarks: number) => {
        setForm((prev: any) => {
            const isSelected = prev.selectedQuestions.includes(qId);
            const newSelected = isSelected
                ? prev.selectedQuestions.filter((id: string) => id !== qId)
                : [...prev.selectedQuestions, qId];

            const newMarks = isSelected
                ? prev.totalMarks - qMarks
                : prev.totalMarks + qMarks;

            return { ...prev, selectedQuestions: newSelected, totalMarks: newMarks };
        });
    };

    const handleSave = async () => {
        if (!form.title || !form.courseId) return toast.error("Title and Course are required");
        if (form.selectedQuestions.length === 0) return toast.error("Select at least 1 question");

        setSubmitting(true);
        // Note: Map state fields to what createAdminQuiz expects or update the server action
        const payload = {
            title: form.title,
            courseId: form.courseId,
            description: form.description,
            timeLimit: Number(form.timeLimit),
            totalMarks: form.totalMarks,
            passingMarks: Number(form.passingMarks),
            shuffleQuestions: form.shuffleQuestions,
            shuffleOptions: form.shuffleOptions,
            maxAttempts: Number(form.maxAttempts),
            preventTabSwitch: form.preventTabSwitch,
            requireFullscreen: form.requireFullscreen,
            trackIpDevice: form.trackIpDevice,
            questions: form.selectedQuestions
        };

        const res = await createAdminQuiz(payload);
        if (res.success) {
            toast.success("Exam published correctly!");
            router.push("/admin/quizzes");
        } else {
            toast.error(res.error || "Failed to create exam");
            setSubmitting(false);
        }
    };

    const filteredBank = questionBank.filter(q => q.content.en.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            {/* Steps Header */}
            <div className="flex border-b bg-slate-50/50">
                {STEPS.map((s, i) => (
                    <button
                        key={s}
                        onClick={() => setStep(i)}
                        className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition-colors ${step === i ? 'bg-white text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                        Step {i + 1}: {s}
                    </button>
                ))}
            </div>

            <div className="p-8">
                {/* Step 1: Basic */}
                {step === 0 && (
                    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Exam Title</label>
                            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Midterm Physics Mock" className="h-12" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Target Course</label>
                            <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Instructions (English)</label>
                            <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[120px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Write exam rules here..." />
                        </div>
                        <Button className="w-full h-12 text-lg" onClick={() => setStep(1)}>Next: Configuration</Button>
                    </div>
                )}

                {/* Step 2: Config */}
                {step === 1 && (
                    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 text-slate-700">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold block mb-2">Time Limit (mins)</label>
                                <Input type="number" value={form.timeLimit} onChange={e => setForm({ ...form, timeLimit: e.target.value })} className="h-12" />
                            </div>
                            <div>
                                <label className="text-sm font-bold block mb-2">Passing Marks</label>
                                <Input type="number" value={form.passingMarks} onChange={e => setForm({ ...form, passingMarks: e.target.value })} className="h-12" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer">
                                <input type="checkbox" checked={form.shuffleQuestions} onChange={e => setForm({ ...form, shuffleQuestions: e.target.checked })} className="w-5 h-5 accent-primary" />
                                <div><p className="font-bold">Shuffle Questions</p><p className="text-xs text-slate-500">Each student gets a different question order</p></div>
                            </label>
                            <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer">
                                <input type="checkbox" checked={form.shuffleOptions} onChange={e => setForm({ ...form, shuffleOptions: e.target.checked })} className="w-5 h-5 accent-primary" />
                                <div><p className="font-bold">Shuffle Options</p><p className="text-xs text-slate-500">MCQ choices are randomized per student</p></div>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="w-full h-12 text-lg" onClick={() => setStep(0)}>Back</Button>
                            <Button className="w-full h-12 text-lg" onClick={() => setStep(2)}>Next: Security</Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Security */}
                {step === 2 && (
                    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 text-slate-700">
                        <div>
                            <label className="text-sm font-bold block mb-2">Max Attempts Allowed</label>
                            <Input type="number" value={form.maxAttempts} onChange={e => setForm({ ...form, maxAttempts: e.target.value })} className="h-12" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 border-2 border-orange-100 bg-orange-50/30 rounded-xl hover:bg-orange-50 cursor-pointer transition-colors">
                                <input type="checkbox" checked={form.preventTabSwitch} onChange={e => setForm({ ...form, preventTabSwitch: e.target.checked })} className="w-5 h-5 accent-orange-500" />
                                <div><p className="font-bold text-orange-900">Prevent Tab Switching</p><p className="text-xs text-orange-700">Auto-submits exam if student leaves browser tab 3 times</p></div>
                            </label>
                            <label className="flex items-center gap-3 p-4 border-2 border-red-100 bg-red-50/30 rounded-xl hover:bg-red-50 cursor-pointer transition-colors">
                                <input type="checkbox" checked={form.requireFullscreen} onChange={e => setForm({ ...form, requireFullscreen: e.target.checked })} className="w-5 h-5 accent-red-500" />
                                <div><p className="font-bold text-red-900">Force Full-Screen Mode</p><p className="text-xs text-red-700">Student cannot start test without entering full screen</p></div>
                            </label>
                            <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                                <input type="checkbox" checked={form.trackIpDevice} onChange={e => setForm({ ...form, trackIpDevice: e.target.checked })} className="w-5 h-5 accent-primary" />
                                <div><p className="font-bold">Track IP & Device</p><p className="text-xs text-slate-500">Log hardware signatures to prevent dual logins</p></div>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="w-full h-12 text-lg" onClick={() => setStep(1)}>Back</Button>
                            <Button className="w-full h-12 text-lg" onClick={() => setStep(3)}>Next: Pick Questions</Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Questions */}
                {step === 3 && (
                    <div className="space-y-6 max-h-[70vh] flex flex-col animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border">
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Search question bank..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Selected Marks</p>
                                <p className="text-3xl font-black text-primary">{form.totalMarks}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto border rounded-xl divide-y">
                            {filteredBank.map(q => {
                                const selected = form.selectedQuestions.includes(q._id);
                                return (
                                    <div key={q._id} className={`p-4 flex gap-4 items-start cursor-pointer transition-colors ${selected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`} onClick={() => toggleQuestion(q._id, q.marks)}>
                                        <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selected ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                                            {selected && <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex gap-2 items-center mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{q.topic}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border px-2 py-0.5 rounded">{q.difficulty}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 px-2 py-0.5 rounded">+{q.marks} Marks</span>
                                            </div>
                                            <p className="font-medium text-slate-800">{q.content.en}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <Button variant="outline" className="h-14 text-lg px-8" onClick={() => setStep(2)}>Back</Button>
                            <Button className="flex-1 h-14 text-lg shadow-xl shadow-primary/20 gap-2 font-black" onClick={handleSave} disabled={submitting}>
                                <Save className="w-5 h-5" /> {submitting ? "Publishing..." : `Publish Exam with ${form.selectedQuestions.length} Questions`}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
