import { getDynamicPageData } from "@/app/actions/cms";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { MessageSquare, MapPin, Phone, Mail, Clock, Zap } from "lucide-react";

const staticFallbackContent = (
    <div className="min-h-screen bg-slate-50 pt-40 pb-24 overflow-hidden relative">
        {/* Ambient background elements */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -ml-96 -mt-96" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -mr-96 -mb-96" />

        <div className="container-custom relative z-10">
            {/* Architectural Header */}
            <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] shadow-sm border border-slate-100">
                    <MessageSquare className="w-4 h-4 text-primary" /> Initiate Dialogue
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter italic">
                    CONNECT <span className="text-primary not-italic underline decoration-slate-200 underline-offset-8">ngit</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                    Whether you're curious about curriculum architecture or operational protocols, our experts are ready to assist.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-start max-w-7xl mx-auto">
                {/* Contact Intelligence Framework */}
                <div className="space-y-10">
                    <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden group hover:shadow-primary/10 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700" />

                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-12">Access Points</h3>

                        <div className="space-y-12">
                            <div className="flex items-start gap-8 group/item">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500 shadow-sm">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tele-Navigation</p>
                                    <div className="flex flex-col">
                                        <a href="tel:+919919303047" className="text-2xl font-black text-slate-900 hover:text-primary transition-colors tracking-tight">+91 9919303047</a>
                                        <a href="tel:+919919303032" className="text-2xl font-black text-slate-900 hover:text-primary transition-colors tracking-tight">+91 9919303032</a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-8 group/item">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all duration-500 shadow-sm">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Digital Logistics</p>
                                    <a href="mailto:ngistudyzone@gmail.com" className="text-2xl font-black text-slate-900 hover:text-indigo-600 transition-colors tracking-tight">ngistudyzone@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-8 group/item">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all duration-500 shadow-sm">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Spatial Identity</p>
                                    <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                                        Stanley Road, Beli<br />
                                        Prayagraj, UP 211002
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Grid */}
                    <div className="bg-slate-950 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mb-32 -mr-32" />
                        <div className="flex items-center gap-4 mb-10">
                            <Clock className="w-7 h-7 text-primary" />
                            <h3 className="text-2xl font-black tracking-tight uppercase italic">Operational Grid</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Cycle A (Mon - Fri)", value: "09:00 - 18:00" },
                                { label: "Cycle B (Sat)", value: "09:00 - 16:00" },
                                { label: "Downtime (Sun)", value: "Systems Offline", dimmed: true }
                            ].map((row, idx) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{row.label}</span>
                                    <span className={`text-lg font-bold ${row.dimmed ? "text-slate-700" : "text-white"}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transmission Input Area */}
                <div className="bg-white p-14 md:p-20 rounded-[5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-bl-[10rem] -z-10" />
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-[12px] border-slate-50">
                        <Zap className="w-8 h-8 text-primary animate-pulse" />
                    </div>

                    <h3 className="text-4xl font-black text-slate-900 mb-12 tracking-tighter italic leading-none">
                        Broadcasting <br /> <span className="text-slate-400 not-italic">System</span>
                    </h3>

                    <div className="space-y-10">
                        <p className="text-slate-500 font-medium leading-relaxed">
                            For immediate technical assistance or curriculum inquiries, please execute a direct transmission via our tele-navigation channels or synthesize a message below.
                        </p>
                        <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 text-center">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Primary Access Protocol</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight italic">+91 98394 46340</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default async function PublicContactPage() {
    const dynamicData = await getDynamicPageData("contact");
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer sections={cmsSections} staticFallback={staticFallbackContent} />
        </div>
    );
}
