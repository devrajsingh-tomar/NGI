"use client";

import { ChevronLeft, ChevronRight, GraduationCap, ShieldCheck, Zap, ArrowRight, User, BookOpen, Award } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Faculty {
    id: number | string;
    name: string;
    subject: string;
    qualification: string;
    experience: string;
    specialization: string;
    image?: string;
}

const defaultFaculty: Faculty[] = [
    {
        id: 1,
        name: "Javed Akhtar",
        subject: "Managing Director",
        qualification: "MCA, PGDCA",
        experience: "15+ Years",
        specialization: "Software Development & IT Strategy",
    },
    {
        id: 2,
        name: "Mohd. Anas",
        subject: "Senior Faculty",
        qualification: "MCA",
        experience: "8 Years",
        specialization: "Advanced Programming & Data Science",
    },
    {
        id: 3,
        name: "Saurabh Mishra",
        subject: "Lab Instructor",
        qualification: "B.Tech",
        experience: "6 Years",
        specialization: "Hardware & Networking Expert",
    },
    {
        id: 4,
        name: "Arifa Khatoon",
        subject: "Typing Expert",
        qualification: "MA, ADCA",
        experience: "10 Years",
        specialization: "Expert Bilingual Typing Specialist",
    },
];

export default function FacultySection({ members, data, showAll = false }: { members?: any[], data?: any, showAll?: boolean }) {
    const [page, setPage] = useState(0);
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    const itemsPerPage = showAll ? 1000 : 4;

    const title = data?.section_name || "Learn from the Industry Masters";
    const subtitle = data?.subtitle || "Elite Faculty";
    
    const displayFaculty = (members && members.length > 0) ? members.map((m, i) => ({
        id: m._id || i,
        name: m.name,
        subject: m.position,
        qualification: m.qualification || "Expert",
        experience: m.experience || "N/A",
        bio: m.bio || "Dedicated professional committed to educational excellence.",
        specialization: m.specialization || "Expert",
        shortBio: m.bio ? (m.bio.length > 100 ? m.bio.substring(0, 100) + "..." : m.bio) : (m.position + " at NGI Study Zone Academy."),
        image: m.image
    })) : (members?.length === 0 ? [] : defaultFaculty.map(f => ({
        ...f,
        id: f.id.toString(),
        bio: f.specialization,
        shortBio: f.specialization
    })));

    if (displayFaculty.length === 0) return null;

    const totalPages = Math.ceil(displayFaculty.length / itemsPerPage);
    const visibleFaculty = showAll ? displayFaculty : displayFaculty.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <section id="faculty" className="py-24 bg-white relative overflow-hidden">
            {/* Architectural Accent */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-slate-50 -z-10" />
            
            <div className="container px-6 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                                {subtitle}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none">
                            {title}
                        </h2>
                    </div>

                    {/* Elite Controls - Only show if not showAll and multiple pages exist */}
                    {!showAll && totalPages > 1 && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-xl transition-all disabled:opacity-20 group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-xl transition-all disabled:opacity-20 group"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="wait">
                        {visibleFaculty.map((faculty, idx) => (
                            <motion.div
                                key={faculty.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.1 }}
                                className="h-full"
                            >
                                <div 
                                    onClick={() => setSelectedFaculty(faculty)}
                                    className="group relative w-full aspect-[3/4] bg-slate-900 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700"
                                >
                                    {/* Prestige Indicator */}
                                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center z-20 border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>

                                    {/* Full Image Background */}
                                    <div className="absolute inset-0 z-0">
                                        {faculty.image ? (
                                            <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                <User className="w-24 h-24 text-slate-600" />
                                            </div>
                                        )}
                                        {/* Classic Vignette Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Layered Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-10 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <h3 className="text-3xl font-black text-white tracking-tight font-serif mb-1 group-hover:text-amber-100 transition-colors">{faculty.name}</h3>
                                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">{faculty.subject}</p>
                                        
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            <p className="text-slate-300 text-sm font-medium italic line-clamp-2 mb-6 border-l-2 border-primary/50 pl-3">
                                                "{faculty.shortBio}"
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-primary hover:border-primary transition-colors">
                                                <span>View Profile</span>
                                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal / Dialog for Classic View */}
            <Dialog open={!!selectedFaculty} onOpenChange={(open) => !open && setSelectedFaculty(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-[2rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.3)] max-h-[95vh] flex flex-col md:block">
                    <DialogTitle className="sr-only">Faculty Profile: {selectedFaculty?.name}</DialogTitle>
                    {selectedFaculty && (
                        <div className="grid md:grid-cols-5 h-full min-h-0">
                            {/* Left Side: Portrait */}
                            <div className="md:col-span-2 relative h-64 md:h-[600px] bg-slate-900 shrink-0">
                                {selectedFaculty.image ? (
                                    <img src={selectedFaculty.image} alt={selectedFaculty.name} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <User className="w-32 h-32 text-slate-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 md:hidden" />
                            </div>

                            {/* Right Side: Details Matrix */}
                            <div className="md:col-span-3 p-8 md:p-12 bg-[#FAFAF9] flex flex-col justify-center overflow-y-auto">
                                <div className="mb-6 pb-6 border-b border-slate-200/60">
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-serif mb-3 leading-tight">{selectedFaculty.name}</h2>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
                                        <Zap className="w-3 h-3" /> {selectedFaculty.subject}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {selectedFaculty.bio && selectedFaculty.bio !== "N/A" && (
                                        <p className="text-slate-600 leading-relaxed font-medium text-lg italic border-l-4 border-primary/20 pl-4">
                                            "{selectedFaculty.bio}"
                                        </p>
                                    )}

                                    <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                        {selectedFaculty.qualification && selectedFaculty.qualification !== "N/A" && (
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                                                    <GraduationCap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qualification</p>
                                                    <p className="font-bold text-slate-800">{selectedFaculty.qualification}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {selectedFaculty.experience && selectedFaculty.experience !== "N/A" && (
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                                                    <Award className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                                                    <p className="font-bold text-slate-800">{selectedFaculty.experience}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedFaculty.specialization && selectedFaculty.specialization !== "N/A" && (
                                            <div className="sm:col-span-2 flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Specialization</p>
                                                    <p className="font-bold text-slate-800">{selectedFaculty.specialization}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* View All Sequence - Only show if NOT showAll */}
            {!showAll && (
                <div className="mt-20 text-center">
                    <Link href="/faculty" className="inline-flex items-center gap-3 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[11px] transition-colors group">
                        Meet All Industry masters & Faculty
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </section>
    );
}
