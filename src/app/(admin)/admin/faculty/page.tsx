"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Plus,
    Users,
    Trash2,
    Mail,
    Phone,
    MoreVertical,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { getFaculty, deleteFaculty } from "@/app/actions/faculty";

export default function AdminFacultyPage() {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFaculty();
    }, []);

    const loadFaculty = async () => {
        try {
            const res = await getFaculty();
            if (res.success) {
                setFaculty(res.faculty);
            } else {
                toast.error("Failed to load faculty");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this faculty member?")) return;
        try {
            await deleteFaculty(id);
            toast.success("Faculty member removed");
            loadFaculty();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Faculty Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage instructor profiles, qualifications, and public bios.</p>
                </div>
                <Link href="/admin/faculty/new">
                    <Button className="gap-2 h-12 rounded-xl px-6 shadow-lg shadow-primary/20 font-bold">
                        <Plus className="w-5 h-5" />
                        Add Faculty Member
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="py-20 text-center flex justify-center items-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin" /> Loading profiles...
                </div>
            ) : faculty.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed rounded-[3rem] bg-slate-50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No faculty members found</h3>
                    <p className="text-slate-400 text-sm mt-1">Start by adding your first instructor profile.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {faculty.map((member) => (
                        <div key={member._id} className="bg-white border rounded-[2rem] p-6 shadow-sm flex items-center gap-6 group hover:border-primary transition-all relative overflow-hidden">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md bg-slate-100 shrink-0">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                                        {member.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{member.position}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Mail className="w-3.5 h-3.5 text-primary" /> {member.email}
                                    </div>
                                    {member.phone && (
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <Phone className="w-3.5 h-3.5 text-primary" /> {member.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 flex gap-2">
                                    <Link href={`/admin/faculty/${member._id}/edit`}>
                                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider border-slate-200">
                                            Edit Profile
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(member._id)} className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-500 hover:bg-red-50">
                                        Remove Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Link href="/admin/faculty/new">
                        <div className="h-full min-h-[160px] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-10 text-slate-400 group hover:border-primary hover:text-primary transition-all cursor-pointer bg-slate-50/50 hover:bg-white">
                            <Plus className="w-8 h-8 mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-xs tracking-widest uppercase">Add Another Faculty</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
