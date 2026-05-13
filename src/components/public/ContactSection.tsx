"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send, Zap, Clock, Globe } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { submitLeadAction } from "@/app/actions/cms-leads";

export default function ContactSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const sectionData = {
        title: data?.title || "Initiate Dialogue",
        subtitle: data?.subtitle || "Connect",
        description: data?.description || "Whether you're curious about curriculum architecture or operational protocols, our experts are ready to assist."
    };

    const firstBlock = blocks && blocks.length > 0 ? blocks[0] : null;
    const extra = typeof firstBlock?.extra_data === 'string' ? JSON.parse(firstBlock.extra_data || "{}") : (firstBlock?.extra_data || {});

    const contactInfo = [
        { label: "Tele-Navigation", value: extra?.phone || "+91 98765 43210", link: `tel:${extra?.phone || "+919876543210"}`, icon: Phone, color: "group-hover/item:bg-primary" },
        { label: "Digital Logistics", value: extra?.email || "info@ngistudyzone.com", link: `mailto:${extra?.email || "info@ngistudyzone.com"}`, icon: Mail, color: "group-hover/item:bg-secondary" },
        { label: "Spatial Identity", value: extra?.address || "123, Tech Corridor, Delhi", icon: MapPin, color: "group-hover/item:bg-emerald-500" }
    ];

    const operationalGrid = [
        { label: "Cycle A (Mon - Fri)", value: extra?.timing_mon_fri || "09:00 - 18:00" },
        { label: "Cycle B (Sat)", value: extra?.timing_sat || "09:00 - 16:00" },
        { label: "Downtime (Sun)", value: extra?.timing_sun || "Systems Offline", dimmed: true }
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const res = await submitLeadAction({
            ...formData,
            source: "Institutional Website Contact Form"
        });

        if (res.success) {
            toast.success(res.message);
            setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
            toast.error(res.error);
        }
        
        setIsSubmitting(false);
    };

    return (
        <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -ml-1/3 -mt-1/3" />
            
            <div className="container px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-300">
                        {sectionData.subtitle}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        {sectionData.title}
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        {sectionData.description}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Intelligence Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Access Points</h3>
                            
                            <div className="space-y-10">
                                {contactInfo.map((info: any, idx: number) => {
                                    const Icon = info.icon === 'Mail' ? Mail : info.icon === 'MapPin' ? MapPin : Phone;
                                    return (
                                        <div key={idx} className="flex items-start gap-6 group/item">
                                            <div className={cn("w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-white transition-all duration-300 shrink-0", info.color || "group-hover/item:bg-primary")}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                                                {info.link ? (
                                                    <a href={info.link} className="text-lg font-black text-slate-900 hover:text-primary transition-colors">{info.value}</a>
                                                ) : (
                                                    <p className="text-lg font-black text-slate-900 leading-tight">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Operational Status */}
                        <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mb-20 -mr-20" />
                            <div className="flex items-center gap-3 mb-8">
                                <Clock className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-black tracking-tight uppercase">Operational Grid</h3>
                            </div>
                            <div className="space-y-4">
                                {operationalGrid.map((row: any, idx: number) => (
                                    <div key={idx} className={cn("flex justify-between items-center py-3 border-white/5", idx !== operationalGrid.length - 1 && "border-b")}>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">{row.label}</span>
                                        <span className={cn("font-bold", row.dimmed && "text-slate-600")}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transmission Form Column */}
                    <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-2xl relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-8 border-slate-50">
                            <Zap className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        
                        <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic">Broadcasting System</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Identifier</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Protocol (Email)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                        placeholder="address@domain.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Payload (Message)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full p-8 rounded-[2.5rem] bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300 resize-none"
                                    placeholder="Synthesize your message..."
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-20 rounded-[2.5rem] bg-slate-950 text-white hover:bg-slate-800 text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {isSubmitting ? (
                                    "Synchronizing..."
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Execute Transmission
                                        <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Dynamic Google Map Section */}
                <div className="mt-20 bg-white p-4 md:p-6 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                    <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden bg-slate-100 relative">
                        {(() => {
                            let cleanUrl = (extra?.map_url || "").trim();
                            
                            // 1. Better Extraction: Detect if it's a full tag or just a URL
                            if (cleanUrl.toLowerCase().includes("<iframe")) {
                                // Extract content inside src="..." or src='...'
                                const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
                                if (srcMatch && srcMatch[1]) {
                                    cleanUrl = srcMatch[1];
                                }
                            }
                            
                            // Decode HTML entities (in case &amp; is present)
                            if (typeof document !== 'undefined') {
                                const txt = document.createElement("textarea");
                                txt.innerHTML = cleanUrl;
                                cleanUrl = txt.value;
                            } else {
                                cleanUrl = cleanUrl.replace(/&amp;/g, '&');
                            }

                            // 2. Policy Enforcement
                            const isGoogleMaps = cleanUrl.includes("google.com/maps");
                            const isEmbedUrl = cleanUrl.includes("/embed") || cleanUrl.includes("pb=");
                            
                            // If it's a Google Maps link but NOT an embed link, Google will block it.
                            // We detect this and use the fallback.
                            const isBlockedByPolicy = isGoogleMaps && !isEmbedUrl;
                            const isShortLink = cleanUrl.includes("goo.gl") || cleanUrl.includes("maps.app.goo.gl");

                            const finalUrl = (cleanUrl && !isBlockedByPolicy && !isShortLink) 
                                ? cleanUrl 
                                : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.5762928460044!2d81.87340689999999!3d25.48582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399ab531fe1e89e1%3A0xc96ab59adb557ac0!2sNational%20Genius%20Institute!5e0!3m2!1sen!2sin!4v1778533252331!5m2!1sen!2sin";
                            
                            return (
                                <iframe
                                    key={finalUrl}
                                    src={finalUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                ></iframe>
                            );
                        })()}
                    </div>
                    {(() => {
                        let cleanUrl = extra?.map_url || "";
                        if (cleanUrl.includes("<iframe") && cleanUrl.includes("src=")) {
                            const match = cleanUrl.match(/src="([^"]+)"/);
                            if (match && match[1]) cleanUrl = match[1];
                        }
                        const isShareLink = cleanUrl && (cleanUrl.includes('goo.gl') || (cleanUrl.includes('google.com/maps') && !cleanUrl.includes('/embed')));
                        
                        if (isShareLink) {
                            return (
                                <div className="absolute top-8 right-8 z-20">
                                    <a 
                                        href={cleanUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" /> Open in Maps App
                                    </a>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        </section>
    );
}
