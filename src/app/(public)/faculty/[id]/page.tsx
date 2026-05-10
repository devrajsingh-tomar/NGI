import { getFacultyById } from "@/app/actions/faculty";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Phone, Calendar, ArrowLeft, ShieldCheck, Zap, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Check if it's a default faculty (numerical ID from my mock)
    // In a real app, we'd only fetch from DB, but for the demo/fallback:
    const res = (id.length > 5) ? await getFacultyById(id) : { success: false, faculty: undefined };

    if (!res.success || !res.faculty) {
        // Fallback or 404
        return (
            <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-8 border border-slate-200">
                    <User className="w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-none">Profile Not Synchronized</h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">We couldn't retrieve the requested professional profile. It may have been relocated or is currently undergoing administrative updates.</p>
                <Link href="/faculty">
                    <Button className="h-20 px-12 rounded-[2rem] bg-slate-950 text-white hover:bg-slate-800 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                        Return to Faculty HUB
                    </Button>
                </Link>
            </div>
        );
    }

    const { faculty } = res;

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Ambient High-Fidelity Header */}
            <div className="h-[25vh] md:h-[30vh] bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-900" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                
                <div className="container px-6 mx-auto h-full flex items-center relative z-10">
                    <Link href="/faculty" className="inline-flex items-center gap-3 text-white/40 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Team HUB
                    </Link>
                </div>
            </div>

            {/* Content Architecture */}
            <div className="container px-6 mx-auto -mt-16 md:-mt-24 pb-32">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
                    
                    {/* Visual & Core ID Profile */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-white p-3 rounded-[4rem] shadow-2xl shadow-slate-200 border border-white relative overflow-hidden group">
                            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-slate-50 shadow-inner">
                                {faculty.image ? (
                                    <Image 
                                        src={faculty.image} 
                                        alt={faculty.name} 
                                        fill
                                        priority
                                        className="object-cover group-hover:scale-105 transition-transform [transition-duration:2s]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <User className="w-32 h-32" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Verified Seal */}
                            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border border-slate-50">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        {/* Direct Connectivity Protocol */}
                        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                Communication Grid
                            </h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Digital Relay</p>
                                        <a href={`mailto:${faculty.email}`} className="text-slate-900 font-black hover:text-primary transition-colors truncate block text-sm">{faculty.email}</a>
                                    </div>
                                </div>

                                {faculty.phone && (
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Voice Uplink</p>
                                            <a href={`tel:${faculty.phone}`} className="text-slate-900 font-black hover:text-primary transition-colors text-sm">{faculty.phone}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Authority Narrative Column */}
                    <div className="lg:col-span-8 space-y-16 lg:pt-32">
                        {/* Primary Identity Segment */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 text-primary border border-primary/10">
                                <Zap className="w-4 h-4 animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{faculty.qualification}</span>
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] italic group-hover:text-primary transition-colors">
                                    {faculty.name}
                                </h1>
                                <p className="text-2xl md:text-4xl font-black text-slate-400 tracking-tight leading-tight">
                                    {faculty.position}
                                </p>
                            </div>
                            
                            <div className="h-2 w-32 bg-primary rounded-full shadow-lg shadow-primary/20" />
                        </div>

                        {/* Biographical Synthesis */}
                        <div className="space-y-10">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4">
                                Professional Dossier <div className="h-px flex-1 bg-slate-200" />
                            </h3>
                            <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-1000" />
                                <p className="text-xl md:text-2xl text-slate-800 font-medium leading-[1.8] italic font-serif relative z-10">
                                    {faculty.bio || "Academic expert dedicated to pioneering curriculum excellence and fostering technological expertise within our next-generation student body."}
                                </p>
                            </div>
                        </div>

                        {/* Institutional Registry Footer */}
                        <div className="pt-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-slate-300" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                                    NGI Study Zone REGISTRY: {id.substring(0, 8).toUpperCase()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
