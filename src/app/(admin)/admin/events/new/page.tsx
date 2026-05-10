"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { createEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        category: "General",
        description: "",
        imageUrl: "",
        registrationLink: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.time || !formData.location) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            // Combine date and time
            const dateTime = new Date(`${formData.date}T${formData.time}:00`);

            const res = await createEvent({
                ...formData,
                date: dateTime.toISOString(),
                status: "UPCOMING"
            });

            if (res.success) {
                toast.success("Event created successfully!");
                router.push("/admin/events");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to create event");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/events">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Create New Event</h1>
                    <p className="text-slate-500 font-medium">Schedule a new workshop, seminar, or activity.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Title <span className="text-red-500">*</span></label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Annual Tech Symposium 2026"
                            className="font-bold text-lg h-12 border-slate-200 focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Time <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Location <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Main Auditorium, Block A"
                            className="h-11 border-slate-200 focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                            <Input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g. Workshop, Seminar, Cultural"
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Registration Link (Optional)</label>
                            <Input
                                value={formData.registrationLink}
                                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                placeholder="https://forms.google.com/..."
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Image URL (Optional)</label>
                        <Input
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="h-11 border-slate-200 focus:border-primary font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description <span className="text-red-500">*</span></label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the event details..."
                            className="min-h-[150px] resize-none border-slate-200 focus:border-primary text-base leading-relaxed"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={loading} size="lg" className="rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold px-8">
                        {loading ? "Creating..." : "Publish Event"}
                        <Save className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
