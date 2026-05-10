"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, User, Mail, Phone, ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getFacultyById, updateFaculty } from "@/app/actions/faculty";

export default function EditFacultyPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        email: "",
        phone: "",
        image: "",
        qualification: "",
        experience: "",
        specialization: "",
        bio: ""
    });

    useEffect(() => {
        if (id) fetchFaculty();
    }, [id]);

    const fetchFaculty = async () => {
        try {
            const res = await getFacultyById(id);
            if (res.success) {
                setFormData({
                    name: res.faculty.name || "",
                    position: res.faculty.position || "",
                    email: res.faculty.email || "",
                    phone: res.faculty.phone || "",
                    image: res.faculty.image || "",
                    qualification: res.faculty.qualification || "",
                    experience: res.faculty.experience || "",
                    specialization: res.faculty.specialization || "",
                    bio: res.faculty.bio || ""
                });
            } else {
                toast.error(res.error);
                router.push("/admin/faculty");
            }
        } catch (error) {
            toast.error("Failed to load faculty member");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateFaculty(id, formData);
            if (res.success) {
                toast.success("Faculty member updated successfully!");
                router.push("/admin/faculty");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to update faculty");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p className="font-bold text-sm uppercase tracking-widest">Loading faculty profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/faculty">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Edit Faculty Profile</h1>
                    <p className="text-slate-500 font-medium">Update the information for this faculty member.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name <span className="text-red-500">*</span></label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Dr. Rahul Sharma"
                                className="font-bold text-lg h-12 border-slate-200 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Position / Title <span className="text-red-500">*</span></label>
                            <Input
                                required
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                placeholder="Head of Mathematics"
                                className="h-12 border-slate-200 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Phone Number
                            </label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <GraduationCap className="w-3 h-3" /> Qualification
                            </label>
                            <Input
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                placeholder="Ph.D. in Applied Mathematics"
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Experience
                            </label>
                            <Input
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="e.g. 10+ Years"
                                className="h-11 border-slate-200 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Area of Specialization</label>
                        <Input
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            placeholder="e.g. Artificial Intelligence, Data Structures"
                            className="h-11 border-slate-200 focus:border-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Image URL</label>
                        <div className="flex gap-4 items-start">
                            {formData.image && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <Input
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/photo.jpg"
                                className="h-11 border-slate-200 focus:border-primary font-mono text-xs flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Short Bio</label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Brief introduction about experience and expertise..."
                            className="min-h-[120px] resize-none border-slate-200 focus:border-primary text-base"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <Link href="/admin/faculty">
                        <Button type="button" variant="ghost" size="lg" className="rounded-xl font-bold px-8">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} size="lg" className="rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold px-8">
                        {loading ? "Saving..." : "Save Changes"}
                        <Save className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
