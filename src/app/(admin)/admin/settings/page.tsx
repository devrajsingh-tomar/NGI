"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Lock, User, Bell, Loader2, MessageSquare, Sliders } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateUserDetails, updateUserPassword } from "@/app/actions/user";
import { Switch } from "@/components/ui/switch";
import { getWebsiteSettings, updateFloatingWidgetSettings } from "@/app/actions/settings";
import { cn } from "@/lib/utils";

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
    const [widgetEnabled, setWidgetEnabled] = useState(false);
    const [widgetType, setWidgetType] = useState<"whatsapp" | "facebook" | "instagram" | "youtube" | "telegram" | "custom">("whatsapp");
    const [widgetValue, setWidgetValue] = useState("");
    const [widgetTooltip, setWidgetTooltip] = useState("Chat with us");

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setSettingsLoading(true);
            const res = await getWebsiteSettings();
            if (res.success && res.settings) {
                const widget = res.settings.floatingWidget || {};
                setWidgetEnabled(!!widget.enabled);
                setWidgetType(widget.type || "whatsapp");
                setWidgetValue(widget.value || "");
                setWidgetTooltip(widget.tooltipText || "Chat with us");
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
        if (widgetEnabled && !widgetValue) {
            return toast.error("Please enter a link or contact details for the floating widget");
        }

        setWidgetSaving(true);
        try {
            const res = await updateFloatingWidgetSettings({
                enabled: widgetEnabled,
                type: widgetType,
                value: widgetValue,
                tooltipText: widgetTooltip,
            });

            if (res.success) {
                toast.success("Floating widget settings updated successfully!");
            } else {
                toast.error(res.error || "Failed to update widget settings");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving widget settings");
        } finally {
            setWidgetSaving(false);
        }
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
                                <h2 className="text-xl font-bold text-slate-900">Floating Contact Widget</h2>
                                <p className="text-[11px] text-slate-400 font-bold mt-0.5">Toggle and configure floating social/WhatsApp support widget</p>
                            </div>
                        </div>
                        {settingsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        ) : (
                            <Switch checked={widgetEnabled} onCheckedChange={setWidgetEnabled} />
                        )}
                    </div>

                    {!settingsLoading && (
                        <div className={cn("space-y-5 transition-all", !widgetEnabled && "opacity-50 pointer-events-none")}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Widget Platform</label>
                                    <select
                                        value={widgetType}
                                        onChange={(e) => setWidgetType(e.target.value as any)}
                                        className="w-full h-12 px-5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold text-xs"
                                    >
                                        <option value="whatsapp">WhatsApp Chat</option>
                                        <option value="telegram">Telegram Chat</option>
                                        <option value="instagram">Instagram Profile</option>
                                        <option value="facebook">Facebook Messenger</option>
                                        <option value="youtube">YouTube Channel</option>
                                        <option value="custom">Custom URL Link</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        {widgetType === "whatsapp" ? "WhatsApp Number (with country code)" : "Destination URL Link"}
                                    </label>
                                    <Input
                                        value={widgetValue}
                                        onChange={(e) => setWidgetValue(e.target.value)}
                                        placeholder={widgetType === "whatsapp" ? "e.g. +919839446340" : "e.g. https://t.me/yourusername"}
                                        className="h-12 rounded-xl border-slate-200 font-bold"
                                    />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase ml-1">
                                        {widgetType === "whatsapp" 
                                            ? "Format: Include '+' and your country code (e.g. +91 for India)" 
                                            : "Ensure the link starts with http:// or https://"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Hover Tooltip Text</label>
                                <Input
                                    value={widgetTooltip}
                                    onChange={(e) => setWidgetTooltip(e.target.value)}
                                    placeholder="e.g. Chat with us on WhatsApp"
                                    className="h-12 rounded-xl border-slate-200 font-bold"
                                    maxLength={50}
                                />
                            </div>

                            <div className="pt-2">
                                <Button 
                                    onClick={handleSaveWidgetSettings} 
                                    disabled={widgetSaving}
                                    className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all hover:scale-[1.02] gap-2"
                                >
                                    {widgetSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Widget Settings
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
