"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, User, Mail, Phone, ArrowLeft, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createFaculty } from "@/app/actions/faculty";

export default function CreateFacultyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await createFaculty(formData);
            if (res.success) {
                toast.success("Faculty member added successfully!");
                router.push("/admin/faculty");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to add faculty");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/faculty">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Add Faculty Member</h1>
                    <p className="text-slate-500 font-medium">Create a profile for a new professor or instructor.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8">
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
                        <Input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/photo.jpg"
                            className="h-11 border-slate-200 focus:border-primary font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Short Bio</label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Brief introduction about experience and expertise..."
                            className="min-h-[100px] resize-none border-slate-200 focus:border-primary text-base"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={loading} size="lg" className="rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold px-8">
                        {loading ? "Adding..." : "Add Faculty"}
                        <Save className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
