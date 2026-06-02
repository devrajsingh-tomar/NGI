"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2, Edit3, Star, Eye, EyeOff, Save, X, 
    AlertCircle, CheckCircle2, MessageSquare, Archive, Award, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
    adminUpdateTestimonial, 
    deleteTestimonial, 
    updateTestimonialStatus 
} from "@/app/actions/testimonials";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

interface Testimonial {
    _id: string;
    studentName: string;
    studentId?: string;
    course: string;
    image?: string;
    review: string;
    rating: number;
    placementCompany?: string;
    status: "published" | "draft" | "archived";
    createdAt: string;
}

const emptyForm = {
    studentName: "",
    course: "",
    review: "",
    rating: 5,
    image: "",
    placementCompany: "",
    status: "draft" as const,
};

// Star Rating Selector
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

// Edit Modal Form
function TestimonialEditModal({
    initial,
    onClose,
    onSaved,
}: {
    initial: Testimonial;
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
            const res = await adminUpdateTestimonial({
                id: initial._id,
                studentName: form.studentName,
                course: form.course,
                review: form.review,
                rating: form.rating,
                image: form.image || undefined,
                placementCompany: form.placementCompany || undefined,
                status: form.status,
            });

            if (res.success) {
                toast.success("Testimonial updated successfully!");
                onSaved();
            } else {
                toast.error(res.error || "Failed to update testimonial");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while saving");
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
                            Edit Testimonial
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">
                            Review and adjust student submission details
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
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center gap-4 shrink-0">
                            <label className={labelClass}>Testimonial Photo</label>
                            <div className="w-24 h-24 rounded-[1.5rem] bg-slate-100 border-2 border-white shadow-md overflow-hidden relative">
                                {form.image ? (
                                    <img src={form.image} alt="Student" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                        <User className="w-8 h-8 text-slate-350" />
                                    </div>
                                )}
                            </div>
                            <ImageUpload 
                                value={form.image} 
                                onChange={(url) => set("image", url)}
                                label="Update Photo"
                                className="w-36"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <label className={labelClass}>Student Name</label>
                                <input
                                    className={inputClass}
                                    value={form.studentName}
                                    onChange={(e) => set("studentName", e.target.value)}
                                    placeholder="e.g. Rahul Sharma"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Course Name</label>
                                <input
                                    className={inputClass}
                                    value={form.course}
                                    onChange={(e) => set("course", e.target.value)}
                                    placeholder="e.g. Full Stack Web Development"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Current Placement (Optional)</label>
                            <input
                                className={inputClass}
                                value={form.placementCompany}
                                onChange={(e) => set("placementCompany", e.target.value)}
                                placeholder="e.g. Software Engineer at Google"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Moderation Status</label>
                            <select
                                className={inputClass}
                                value={form.status}
                                onChange={(e) => set("status", e.target.value)}
                            >
                                <option value="draft">Pending Approval (Draft)</option>
                                <option value="published">Published (Live on Home)</option>
                                <option value="archived">Archived (Hidden)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Review Content</label>
                        <textarea
                            className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all resize-none"
                            value={form.review}
                            onChange={(e) => set("review", e.target.value)}
                            placeholder="Student feedback content..."
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Rating (Stars)</label>
                        <StarInput
                            value={form.rating}
                            onChange={(v) => set("rating", v)}
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.01] gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "Saving..." : "Update Testimonial"}
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

// Main Testimonial Admin Client
export default function TestimonialsAdminClient({
    testimonials: initial,
    total,
}: {
    testimonials: Testimonial[];
    total: number;
}) {
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);

    const refresh = () => {
        setEditing(null);
        router.refresh();
    };

    const handleDelete = async (t: Testimonial) => {
        if (!confirm(`Are you sure you want to delete Rahul's review? This cannot be undone.`)) return;
        setActionId(t._id);
        const res = await deleteTestimonial({ id: t._id });
        if (res.success) {
            toast.success("Testimonial deleted successfully");
            refresh();
        } else {
            toast.error(res.error || "Failed to delete testimonial");
        }
        setActionId(null);
    };

    const handleUpdateStatus = async (id: string, status: "published" | "draft" | "archived") => {
        setActionId(id);
        const res = await updateTestimonialStatus({ id, status });
        if (res.success) {
            toast.success(`Testimonial status set to ${status}`);
            refresh();
        } else {
            toast.error(res.error || "Failed to update status");
        }
        setActionId(null);
    };

    const filteredTestimonials = initial.filter((t) => {
        if (filter === "all") return true;
        return t.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Edit Modal */}
            <AnimatePresence>
                {editing && (
                    <TestimonialEditModal
                        initial={editing}
                        onClose={() => setEditing(null)}
                        onSaved={refresh}
                    />
                )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b pb-4 overflow-x-auto scrollbar-hide">
                {(["all", "draft", "published", "archived"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                            filter === status
                                ? "bg-primary text-white shadow-md shadow-primary/10"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        {status === "all" ? "All Submissions" : status === "draft" ? "Pending Approval" : status}
                    </button>
                ))}
            </div>

            {/* List Content */}
            {filteredTestimonials.length === 0 ? (
                <div className="py-24 text-center space-y-6 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-slate-200" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">No testimonials here</h3>
                        <p className="text-slate-500 font-medium mt-2">
                            Submissions matching your filter will be shown here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredTestimonials.map((t) => (
                        <div
                            key={t._id}
                            className={cn(
                                "bg-white border rounded-[2rem] p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all hover:border-slate-300",
                                actionId === t._id && "opacity-50 pointer-events-none scale-95"
                            )}
                        >
                            {/* Card Status Indicator Bar */}
                            <div className={cn(
                                "absolute top-0 left-0 right-0 h-1.5",
                                t.status === "published" 
                                    ? "bg-emerald-400" 
                                    : t.status === "archived" 
                                    ? "bg-slate-300" 
                                    : "bg-amber-400"
                            )} />

                            {/* Header Info */}
                            <div className="flex items-start justify-between gap-4 mt-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-50 shrink-0">
                                        {t.image ? (
                                            <img src={t.image} alt={t.studentName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                                                {t.studentName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{t.studentName}</h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">
                                            {t.course}
                                        </p>
                                        {t.placementCompany && (
                                            <p className="text-[9px] text-slate-500 font-bold mt-0.5">
                                                Placed: {t.placementCompany}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Badge
                                    className={cn(
                                        "border-none text-[9px] font-black uppercase tracking-widest shrink-0",
                                        t.status === "published"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : t.status === "archived"
                                            ? "bg-slate-100 text-slate-400"
                                            : "bg-amber-50 text-amber-600"
                                    )}
                                >
                                    {t.status === "draft" ? "Pending Approval" : t.status}
                                </Badge>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < t.rating 
                                                ? "text-amber-400 fill-amber-400" 
                                                : "text-slate-200 fill-slate-200"
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Review Content */}
                            <p className="text-slate-600 text-sm font-medium leading-relaxed italic flex-1">
                                "{t.review}"
                            </p>

                            {/* Actions Bar */}
                            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-50 mt-2">
                                <div className="flex items-center gap-2">
                                    {t.status !== "published" && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleUpdateStatus(t._id, "published")}
                                            className="h-9 px-4 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-bold text-xs uppercase tracking-wider gap-1.5"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                        </Button>
                                    )}
                                    {t.status === "published" && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleUpdateStatus(t._id, "draft")}
                                            className="h-9 px-4 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 border-none font-bold text-xs uppercase tracking-wider gap-1.5"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" /> Unpublish
                                        </Button>
                                    )}
                                    {t.status !== "archived" && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleUpdateStatus(t._id, "archived")}
                                            className="h-9 px-3 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider gap-1.5"
                                            title="Archive Review"
                                        >
                                            <Archive className="w-3.5 h-3.5" /> Archive
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setEditing(t)}
                                        className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                        title="Edit Review"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t)}
                                        className="h-9 w-9 rounded-xl bg-red-50 text-red-550 hover:bg-red-100 flex items-center justify-center transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
