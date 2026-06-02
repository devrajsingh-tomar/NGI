"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Lock, User, Bell, Loader2, MessageSquare, Sliders, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateUserDetails, updateUserPassword } from "@/app/actions/user";
import { Switch } from "@/components/ui/switch";
import { getWebsiteSettings, updateFloatingWidgetSettings } from "@/app/actions/settings";
import { cn } from "@/lib/utils";

interface FloatingWidget {
    enabled: boolean;
    type: "whatsapp" | "facebook" | "instagram" | "youtube" | "telegram" | "linkedin" | "email" | "custom";
    value: string;
    tooltipText: string;
}

export default function AdminSettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    
    // Profile State
    const [name, setName] = useState(session?.user?.name || "");
    
    // Password State
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    // Floating Widget States
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [widgetSaving, setWidgetSaving] = useState(false);
    const [widgets, setWidgets] = useState<FloatingWidget[]>([]);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setSettingsLoading(true);
            const res = await getWebsiteSettings();
            if (res.success && res.settings) {
                const loadedWidgets = res.settings.floatingWidgets || [];
                setWidgets(loadedWidgets.map((w: any) => ({
                    enabled: typeof w.enabled === "boolean" ? w.enabled : true,
                    type: w.type || "whatsapp",
                    value: w.value || "",
                    tooltipText: w.tooltipText || "Chat with us"
                })));
            } else {
                toast.error("Failed to load website settings");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!name) return toast.error("Name is required");
        setLoading(true);
        const res = await updateUserDetails({ name });
        if (res.success) {
            await update({ name }); // This triggers the JWT/Session update callback
            toast.success("Profile updated successfully");
        } else {
            toast.error(res.error || "Failed to update profile");
        }
        setLoading(false);
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new) return toast.error("Fill all fields");
        if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");
        
        setPwdLoading(true);
        const res = await updateUserPassword({ current: passwords.current, new: passwords.new });
        if (res.success) {
            toast.success("Password updated successfully");
            setPasswords({ current: "", new: "", confirm: "" });
        } else {
            toast.error(res.error || "Failed to update password");
        }
        setPwdLoading(false);
    };

    const handleSaveWidgetSettings = async () => {
        for (let i = 0; i < widgets.length; i++) {
            if (widgets[i].enabled && !widgets[i].value) {
                return toast.error(`Please enter a link or contact details for Widget #${i + 1}`);
            }
        }

        setWidgetSaving(true);
        try {
            const res = await updateFloatingWidgetSettings({
                widgets: widgets.map(w => ({
                    enabled: w.enabled,
                    type: w.type,
                    value: w.value,
                    tooltipText: w.tooltipText || "Chat with us"
                }))
            });

            if (res.success) {
                toast.success("Floating widgets updated successfully!");
                loadSettings();
            } else {
                toast.error(res.error || "Failed to update widgets settings");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving widget settings");
        } finally {
            setWidgetSaving(false);
        }
    };

    const addWidget = () => {
        setWidgets([...widgets, {
            enabled: true,
            type: "whatsapp",
            value: "",
            tooltipText: "Chat with us"
        }]);
    };

    const removeWidget = (index: number) => {
        setWidgets(widgets.filter((_, i) => i !== index));
    };

    const updateWidgetField = (index: number, field: keyof FloatingWidget, val: any) => {
        const copy = [...widgets];
        copy[index] = { ...copy[index], [field]: val };
        setWidgets(copy);
    };

    const moveWidget = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === widgets.length - 1) return;
        const newIndex = direction === "up" ? index - 1 : index + 1;
        const copy = [...widgets];
        const temp = copy[index];
        copy[index] = copy[newIndex];
        copy[newIndex] = temp;
        setWidgets(copy);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your administrative credentials and website configurations</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Admin Name</label>
                            <Input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 rounded-xl focus:ring-primary/20 border-slate-200"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address (Primary)</label>
                            <Input value={session?.user?.email || ""} disabled className="h-12 rounded-xl bg-slate-50 border-slate-100 text-slate-400 font-medium cursor-not-allowed" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Contact system owner to change email</p>
                        </div>
                        <div className="pt-2">
                            <Button onClick={handleSaveProfile} disabled={loading} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Profile Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Floating widget settings section */}
                <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Floating Contact Stack</h2>
                                <p className="text-[11px] text-slate-400 font-bold mt-0.5">Toggle and configure floating social/contact widgets stacked vertically</p>
                            </div>
                        </div>
                        {settingsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        ) : (
                            <Button 
                                onClick={addWidget}
                                size="sm" 
                                className="h-9 rounded-xl font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
                            >
                                <Plus className="w-4 h-4" /> Add Widget
                            </Button>
                        )}
                    </div>

                    {!settingsLoading && (
                        <div className="space-y-6">
                            {widgets.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-sm font-bold text-slate-400">No floating widgets added yet</p>
                                    <Button onClick={addWidget} variant="outline" className="mt-3 h-10 rounded-xl font-bold text-xs">
                                        Create your first widget
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {widgets.map((widget, index) => (
                                        <div 
                                            key={index} 
                                            className={cn(
                                                "border rounded-2xl p-5 bg-slate-50/50 transition-all",
                                                !widget.enabled && "opacity-60 bg-slate-100/50"
                                            )}
                                        >
                                            {/* Widget header controls */}
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Widget #{index + 1}</span>
                                                    {!widget.enabled && (
                                                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">Disabled</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        disabled={index === 0}
                                                        onClick={() => moveWidget(index, "up")}
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                                                    >
                                                        <ArrowUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        disabled={index === widgets.length - 1}
                                                        onClick={() => moveWidget(index, "down")}
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                                                    >
                                                        <ArrowDown className="w-4 h-4" />
                                                    </Button>
                                                    <div className="w-px h-5 bg-slate-200 mx-1" />
                                                    <Switch 
                                                        checked={widget.enabled} 
                                                        onCheckedChange={(val) => updateWidgetField(index, "enabled", val)} 
                                                    />
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => removeWidget(index)}
                                                        className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Widget Form Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 ml-1">Platform Type</label>
                                                    <select
                                                        value={widget.type}
                                                        onChange={(e) => updateWidgetField(index, "type", e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold text-xs"
                                                    >
                                                        <option value="whatsapp">WhatsApp Chat</option>
                                                        <option value="telegram">Telegram Chat</option>
                                                        <option value="instagram">Instagram Profile</option>
                                                        <option value="facebook">Facebook Messenger</option>
                                                        <option value="linkedin">LinkedIn Page</option>
                                                        <option value="youtube">YouTube Channel</option>
                                                        <option value="email">Email Address</option>
                                                        <option value="custom">Custom URL Link</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-xs font-bold text-slate-500 ml-1">
                                                        {widget.type === "whatsapp" 
                                                            ? "WhatsApp Number (with country code)" 
                                                            : widget.type === "email"
                                                            ? "Email Address"
                                                            : "Destination URL Link"}
                                                    </label>
                                                    <Input
                                                        value={widget.value}
                                                        onChange={(e) => updateWidgetField(index, "value", e.target.value)}
                                                        placeholder={
                                                            widget.type === "whatsapp" 
                                                                ? "e.g. +919839446340" 
                                                                : widget.type === "email"
                                                                ? "e.g. info@ngistudyzone.com"
                                                                : "e.g. https://t.me/username"
                                                        }
                                                        className="h-11 rounded-xl border-slate-200 font-medium text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-3 space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 ml-1">Hover Tooltip Text</label>
                                                <Input
                                                    value={widget.tooltipText}
                                                    onChange={(e) => updateWidgetField(index, "tooltipText", e.target.value)}
                                                    placeholder="e.g. Connect on LinkedIn"
                                                    className="h-11 rounded-xl border-slate-200 font-medium text-sm"
                                                    maxLength={50}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    Total widgets: {widgets.length}
                                </p>
                                <Button 
                                    onClick={handleSaveWidgetSettings} 
                                    disabled={widgetSaving}
                                    className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all hover:scale-[1.02] gap-2"
                                >
                                    {widgetSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Stack Settings
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Security & Credentials</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Current Secure Password</label>
                            <Input 
                                type="password" 
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                className="h-12 rounded-xl border-slate-200"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                <Input 
                                    type="password" 
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                <Input 
                                    type="password" 
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200"
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button onClick={handleUpdatePassword} disabled={pwdLoading} variant="outline" className="h-12 px-8 rounded-xl font-bold border-2 border-slate-100 hover:bg-slate-50">
                                {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                Update Security Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
