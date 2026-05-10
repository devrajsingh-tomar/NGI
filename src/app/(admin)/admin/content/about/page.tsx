"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2, Target, Eye, BarChart3, Info, BadgeInfo, CheckCircle } from "lucide-react";
import { getAboutPageData, updateAboutPageData } from "@/app/actions/about";

export default function AboutManagementPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"hero" | "intro" | "others">("hero");

    const [aboutData, setAboutData] = useState<any>({
        hero: { badge: "", title: "", subtitle: "" },
        intro: { title: "", text1: "", text2: "", image: "" },
        checklist: [],
        mission: { title: "", text: "" },
        vision: { title: "", text: "" },
        stats: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const result = await getAboutPageData();
        if (result.success) {
            setAboutData(result.data);
        } else {
            toast.error("Failed to load data");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const result = await updateAboutPageData(aboutData);
        if (result.success) {
            toast.success("About Us page updated!");
        } else {
            toast.error(result.error || "Failed to update page");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-center">Loading content...</div>;

    return (
        <div className="p-8 pb-20 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">About Us Management</h1>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">Page Section CMS</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all font-bold gap-2"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-8 w-fit shadow-inner">
                {[
                    { id: "hero", label: "Hero Header", icon: BadgeInfo },
                    { id: "intro", label: "Main Intro", icon: Info },
                    { id: "others", label: "Mission, Stats & More", icon: BarChart3 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-8">
                {activeTab === "hero" && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-amber-600">
                                <BadgeInfo className="w-5 h-5" />
                             </div>
                             <h2 className="text-xl font-black text-slate-900">Hero Section</h2>
                        </div>
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Badge Label</label>
                                <Input 
                                    value={aboutData.hero.badge} 
                                    onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, badge: e.target.value}})}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary font-bold"
                                    placeholder="e.g. About Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Title</label>
                                <Input 
                                    value={aboutData.hero.title} 
                                    onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, title: e.target.value}})}
                                    className="h-12 rounded-xl border-slate-200 focus:ring-primary font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Subtitle / Description</label>
                                <Textarea 
                                    value={aboutData.hero.subtitle} 
                                    onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, subtitle: e.target.value}})}
                                    className="rounded-xl border-slate-200 min-h-[120px] focus:ring-primary font-semibold"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "intro" && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Info className="w-5 h-5" />
                             </div>
                             <h2 className="text-xl font-black text-slate-900">Introduction Area</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Intro Title</label>
                                    <Input 
                                        value={aboutData.intro.title} 
                                        onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, title: e.target.value}})}
                                        className="h-12 rounded-xl border-slate-200 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Paragraph 1</label>
                                    <Textarea 
                                        value={aboutData.intro.text1} 
                                        onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, text1: e.target.value}})}
                                        className="rounded-xl border-slate-200 min-h-[100px] font-semibold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Paragraph 2</label>
                                    <Textarea 
                                        value={aboutData.intro.text2} 
                                        onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, text2: e.target.value}})}
                                        className="rounded-xl border-slate-200 min-h-[100px] font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Feature Image URL</label>
                                    <Input 
                                        value={aboutData.intro.image} 
                                        onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, image: e.target.value}})}
                                        className="h-12 rounded-xl border-slate-200 font-bold"
                                    />
                                    {aboutData.intro.image && (
                                        <div className="mt-4 rounded-3xl overflow-hidden border h-[240px] relative shadow-inner">
                                            <img src={aboutData.intro.image} className="object-cover w-full h-full" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                             <div className="flex items-center justify-between mb-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Checklist Items
                                </label>
                                <Button 
                                    onClick={() => setAboutData({...aboutData, checklist: [...(aboutData.checklist || []), ""]})}
                                    variant="outline" size="sm" className="rounded-xl h-8 text-xs font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Item
                                </Button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aboutData.checklist?.map((item: string, idx: number) => (
                                    <div key={idx} className="flex gap-2 group">
                                        <Input 
                                            value={item} 
                                            onChange={(e) => {
                                                const newList = [...aboutData.checklist];
                                                newList[idx] = e.target.value;
                                                setAboutData({...aboutData, checklist: newList});
                                            }}
                                            className="h-10 rounded-lg font-bold"
                                        />
                                        <Button 
                                            onClick={() => {
                                                const newList = aboutData.checklist.filter((_: any, i: number) => i !== idx);
                                                setAboutData({...aboutData, checklist: newList});
                                            }}
                                            variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === "others" && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                             {/* Mission */}
                            <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-200/10 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Mission</h2>
                                </div>
                                <Input 
                                    value={aboutData.mission.title} 
                                    onChange={(e) => setAboutData({...aboutData, mission: {...aboutData.mission, title: e.target.value}})}
                                    className="h-10 rounded-lg font-bold"
                                    placeholder="Mission Title"
                                />
                                <Textarea 
                                    value={aboutData.mission.text} 
                                    onChange={(e) => setAboutData({...aboutData, mission: {...aboutData.mission, text: e.target.value}})}
                                    className="rounded-xl border-slate-200 min-h-[80px] font-semibold"
                                />
                            </div>

                             {/* Vision */}
                            <div className="bg-white p-8 rounded-[2rem] border border-amber-100 shadow-xl shadow-amber-200/10 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Vision</h2>
                                </div>
                                <Input 
                                    value={aboutData.vision.title} 
                                    onChange={(e) => setAboutData({...aboutData, vision: {...aboutData.vision, title: e.target.value}})}
                                    className="h-10 rounded-lg font-bold"
                                    placeholder="Vision Title"
                                />
                                <Textarea 
                                    value={aboutData.vision.text} 
                                    onChange={(e) => setAboutData({...aboutData, vision: {...aboutData.vision, text: e.target.value}})}
                                    className="rounded-xl border-slate-200 min-h-[80px] font-semibold"
                                />
                            </div>
                        </div>

                         {/* Stats */}
                         <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl space-y-8">
                             <div className="flex justify-between items-center text-white">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight">Highlight Statistics</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Impact & Scale</p>
                                </div>
                                <Button 
                                    onClick={() => setAboutData({...aboutData, stats: [...aboutData.stats, { label: "", value: "", icon: "Award" }]})}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Stat
                                </Button>
                             </div>

                             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {aboutData.stats.map((stat: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4 relative group">
                                        <button 
                                            onClick={() => {
                                                const newList = aboutData.stats.filter((_: any, i: number) => i !== idx);
                                                setAboutData({...aboutData, stats: newList});
                                            }}
                                            className="absolute top-4 right-4 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <Input 
                                            value={stat.value} 
                                            onChange={(e) => {
                                                const newList = [...aboutData.stats];
                                                newList[idx].value = e.target.value;
                                                setAboutData({...aboutData, stats: newList});
                                            }}
                                            className="bg-transparent border-white/20 text-white h-12 text-2xl font-black focus:ring-primary rounded-xl"
                                            placeholder="50+"
                                        />
                                        <Input 
                                            value={stat.label} 
                                            onChange={(e) => {
                                                const newList = [...aboutData.stats];
                                                newList[idx].label = e.target.value;
                                                setAboutData({...aboutData, stats: newList});
                                            }}
                                            className="bg-transparent border-white/20 text-slate-300 font-bold focus:ring-primary rounded-xl"
                                            placeholder="Label"
                                        />
                                    </div>
                                ))}
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}
