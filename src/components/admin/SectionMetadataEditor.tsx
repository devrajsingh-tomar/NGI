"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Save } from "lucide-react";

interface SectionMetadataEditorProps {
    section: any;
    onUpdate: (id: string, updates: any) => Promise<void>;
}

export function SectionMetadataEditor({ section, onUpdate }: SectionMetadataEditorProps) {
    const [formData, setFormData] = useState({
        section_name: section?.section_name || "",
        subtitle: section?.subtitle || "",
        description: section?.description || "",
        image: section?.image || "",
        button_text: section?.button_text || "",
        button_link: section?.button_link || ""
    });
    const [loading, setLoading] = useState(false);

    // Sync formData when section changes
    useEffect(() => {
        setFormData({
            section_name: section?.section_name || "",
            subtitle: section?.subtitle || "",
            description: section?.description || "",
            image: section?.image || "",
            button_text: section?.button_text || "",
            button_link: section?.button_link || ""
        });
    }, [section]);

    const handleSave = async () => {
        setLoading(true);
        await onUpdate(section._id, formData);
        setLoading(false);
    };

    if (!section) return null;

    const FIELD_CONFIG: Record<string, { desc: boolean, img: boolean, btn: boolean }> = {
        "ContactSection": { desc: true, img: false, btn: false },
        "TrustIndicators": { desc: false, img: false, btn: false },
        "WhyChooseSection": { desc: false, img: false, btn: false },
        "AboutSection": { desc: false, img: false, btn: false },
        "AchievementsSection": { desc: false, img: false, btn: false },
        "VideoFeedbackSection": { desc: true, img: false, btn: false },
        "TestimonialSlider": { desc: true, img: false, btn: false },
    };

    const config = FIELD_CONFIG[section.section_type] || { desc: true, img: true, btn: true };

    // If a section uses absolutely no global fields, we could hide it, but all use at least Title/Subtitle.

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Section Settings</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Manage titles, images, and buttons for this module globally.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-xl">
                    {loading ? "Saving..." : <><Save className="w-4 h-4 mr-3" /> Save Settings</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Primary Headline / Section Name</Label>
                        <Input value={formData.section_name} onChange={e => setFormData({...formData, section_name: e.target.value})} className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl font-black text-lg px-6" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Overline Subtitle</Label>
                        <Input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl font-medium text-slate-600 px-6" />
                    </div>
                    {config.desc && (
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Description / Narrative</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-32 bg-slate-50/50 border-slate-200 rounded-2xl resize-none font-medium text-slate-600 p-6" />
                        </div>
                    )}
                </div>

                {(config.img || config.btn) && (
                    <div className="space-y-6">
                        {config.img && (
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Primary Section Image (Optional)</Label>
                                <div className="bg-slate-50/50 border border-slate-200 rounded-[2rem] p-3 h-[200px] overflow-hidden">
                                    <ImageUpload value={formData.image} onChange={(url) => setFormData({...formData, image: url})} onRemove={() => setFormData({...formData, image: ""})} />
                                </div>
                            </div>
                        )}
                        {config.btn && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Button Label</Label>
                                    <Input value={formData.button_text} onChange={e => setFormData({...formData, button_text: e.target.value})} className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl font-bold px-6" placeholder="e.g., View More" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Button Link</Label>
                                    <Input value={formData.button_link} onChange={e => setFormData({...formData, button_link: e.target.value})} className="h-14 bg-slate-50/50 border-slate-200 rounded-2xl font-bold px-6" placeholder="/about" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
