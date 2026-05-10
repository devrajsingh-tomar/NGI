"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Edit3, Video, Star, Eye, EyeOff,
    Save, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertFeedback, deleteFeedback, toggleFeedbackActive } from "@/app/actions/feedback";
import { cn } from "@/lib/utils";

interface Feedback {
    _id: string;
    name?: string;
    role?: string;
    course?: string;
    videoUrl: string;
    aspectRatio?: "16:9" | "9:16" | "1:1";
    review?: string;
    rating?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

const emptyForm = {
    name: "",
    role: "",
    course: "",
    videoUrl: "",
    aspectRatio: "16:9",
    review: "",
    rating: 5,
    isActive: true,
    sortOrder: 0,
};

// ─── Star Rating Input ────────────────────────────────────────────────────────

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(i + 1)}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                    aria-label={`Rate ${i + 1} stars`}
                >
                    <Star
                        className={`w-6 h-6 transition-colors ${
                            i < (hovered || value)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-200"
                        }`}
                    />
                </button>
            ))}
            <span className="ml-2 text-sm font-black text-slate-600">{value}/5</span>
        </div>
    );
}

// ─── Feedback Form ────────────────────────────────────────────────────────────

function FeedbackForm({
    initial,
    onClose,
    onSaved,
}: {
    initial?: Partial<Feedback> & { _id?: string };
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState({ ...emptyForm, ...initial });
    const [saving, setSaving] = useState(false);

    const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload: any = {
                name: form.name,
                role: form.role || undefined,
                course: form.course || undefined,
                videoUrl: form.videoUrl,
                aspectRatio: form.aspectRatio,
                review: form.review,
                rating: form.rating || undefined,
                isActive: form.isActive,
                sortOrder: Number(form.sortOrder),
            };
            if (initial?._id) payload.id = initial._id;

            const res = await upsertFeedback(payload);
            if (res.success) {
                toast.success(initial?._id ? "Feedback updated!" : "Feedback added!");
                onSaved();
            } else {
                toast.error(res.error);
            }
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full h-12 px-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all";
    const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-10 space-y-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {initial?._id ? "Edit" : "Add"} Testimonial
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">
                            Video feedback from students
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Student Name</label>
                            <input
                                className={inputClass}
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="e.g. Rahul Sharma"
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Role / Designation</label>
                            <input
                                className={inputClass}
                                value={form.role}
                                onChange={(e) => set("role", e.target.value)}
                                placeholder="e.g. Software Engineer"
                                maxLength={100}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Course Enrolled</label>
                        <input
                            className={inputClass}
                            value={form.course}
                            onChange={(e) => set("course", e.target.value)}
                            placeholder="e.g. Advanced Web Development"
                            maxLength={150}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Video URL * (YouTube, Vimeo, or direct MP4)</label>
                            <input
                                className={inputClass}
                                type="url"
                                value={form.videoUrl}
                                onChange={(e) => set("videoUrl", e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                                Supported: YouTube, YouTube Shorts, Vimeo, direct .mp4 links
                            </p>
                        </div>
                        <div>
                            <label className={labelClass}>Video Aspect Ratio</label>
                            <select
                                className={inputClass}
                                value={form.aspectRatio || "16:9"}
                                onChange={(e) => set("aspectRatio", e.target.value)}
                            >
                                <option value="16:9">Standard Horizontal (16:9)</option>
                                <option value="9:16">Vertical / Shorts (9:16)</option>
                                <option value="1:1">Square (1:1)</option>
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                                Adjusts layout. YouTube shorts default to 9:16 automatically.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Review Text (Max 1000 chars)</label>
                        <textarea
                            className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all resize-none"
                            value={form.review}
                            onChange={(e) => set("review", e.target.value)}
                            placeholder="What the student says about NGI Study Zone..."
                            rows={4}
                            maxLength={1000}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 ml-1 text-right">
                            {form.review.length}/1000
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Star Rating (optional)</label>
                        <StarInput
                            value={form.rating || 5}
                            onChange={(v) => set("rating", v)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Sort Order</label>
                            <input
                                className={inputClass}
                                type="number"
                                min={0}
                                max={999}
                                value={form.sortOrder}
                                onChange={(e) => set("sortOrder", Number(e.target.value))}
                            />
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">Lower = shown first</p>
                        </div>
                        <div>
                            <label className={labelClass}>Visibility</label>
                            <button
                                type="button"
                                onClick={() => set("isActive", !form.isActive)}
                                className={cn(
                                    "w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                    form.isActive
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 text-slate-500"
                                )}
                            >
                                {form.isActive ? (
                                    <><Eye className="w-4 h-4" /> Visible</>
                                ) : (
                                    <><EyeOff className="w-4 h-4" /> Hidden</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.01] gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "Saving..." : initial?._id ? "Update" : "Add Testimonial"}
                        </Button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-14 px-8 rounded-2xl bg-slate-50 text-slate-500 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

// ─── Main Admin Client ────────────────────────────────────────────────────────

export default function FeedbackAdminClient({
    feedbacks: initial,
    total,
}: {
    feedbacks: Feedback[];
    total: number;
}) {
    const router = useRouter();
    const [feedbacks, setFeedbacks] = useState(initial);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Feedback | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const refresh = () => {
        setShowForm(false);
        setEditing(null);
        router.refresh();
    };

    const handleDelete = async (fb: Feedback) => {
        if (!confirm(`Delete testimonial from "${fb.name}"? This cannot be undone.`)) return;
        setDeletingId(fb._id);
        const res = await deleteFeedback({ id: fb._id });
        if (res.success) {
            toast.success("Testimonial deleted");
            refresh();
        } else {
            toast.error((res as any).error || "Failed to delete");
        }
        setDeletingId(null);
    };

    const handleToggle = async (fb: Feedback) => {
        setTogglingId(fb._id);
        const res = await toggleFeedbackActive({ id: fb._id, isActive: !fb.isActive });
        if (res.success) {
            toast.success(`Testimonial ${fb.isActive ? "hidden" : "shown"}`);
            refresh();
        } else {
            toast.error((res as any).error ?? "Failed");
        }
        setTogglingId(null);
    };

    return (
        <>
            {/* Form Modal */}
            <AnimatePresence>
                {(showForm || editing) && (
                    <FeedbackForm
                        initial={editing ?? undefined}
                        onClose={() => { setShowForm(false); setEditing(null); }}
                        onSaved={refresh}
                    />
                )}
            </AnimatePresence>

            {/* Add Button */}
            <div className="flex justify-end mb-8">
                <Button
                    onClick={() => setShowForm(true)}
                    className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Testimonial
                </Button>
            </div>

            {/* Content */}
            {feedbacks.length === 0 ? (
                <div className="py-24 text-center space-y-6 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <Video className="w-10 h-10 text-slate-200" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">No testimonials yet</h3>
                        <p className="text-slate-500 font-medium mt-2">
                            Add your first video feedback to display on the website.
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(true)} className="rounded-2xl h-12 px-8 font-black gap-2">
                        <Plus className="w-4 h-4" /> Add First Testimonial
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {feedbacks.map((fb, idx) => (
                        <motion.div
                            key={fb._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className={cn(
                                "bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col",
                                (deletingId === fb._id || togglingId === fb._id) && "opacity-50 pointer-events-none scale-95",
                                !fb.isActive && "border-dashed"
                            )}
                        >
                            {/* Status Bar */}
                            <div className={cn("h-1.5", fb.isActive ? "bg-emerald-400" : "bg-slate-200")} />

                            <div className="p-6 space-y-4 flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic text-lg shrink-0">
                                            {fb.name ? fb.name.charAt(0) : "V"}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 leading-none">{fb.name || "Video Testimonial"}</p>
                                            {fb.role && (
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    {fb.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            "border-none text-[9px] font-black uppercase tracking-widest shrink-0",
                                            fb.isActive
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-400"
                                        )}
                                    >
                                        {fb.isActive ? "Active" : "Hidden"}
                                    </Badge>
                                </div>

                                {/* Stars */}
                                {fb.rating ? (
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < fb.rating! ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                                            />
                                        ))}
                                    </div>
                                ) : null}

                                {/* Review snippet */}
                                {fb.review && (
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic line-clamp-3">
                                        "{fb.review}"
                                    </p>
                                )}

                                {/* Video URL */}
                                <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 rounded-xl">
                                    <Video className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-[10px] font-black text-slate-500 truncate">
                                        {fb.videoUrl}
                                    </span>
                                </div>

                                {/* Sort & Date */}
                                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Order: #{fb.sortOrder}</span>
                                    <span suppressHydrationWarning>{new Date(fb.createdAt).toLocaleDateString("en-GB")}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-slate-50 flex items-center gap-2">
                                <button
                                    onClick={() => setEditing(fb)}
                                    className="flex-1 h-10 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleToggle(fb)}
                                    className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all hover:scale-[1.05]",
                                        fb.isActive
                                            ? "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-500"
                                            : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                                    )}
                                    title={fb.isActive ? "Hide" : "Show"}
                                >
                                    {fb.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handleDelete(fb)}
                                    className="h-10 w-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all hover:scale-[1.05]"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}
