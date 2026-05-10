"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getNotices, createNotice, updateNotice, deleteNotice } from "@/app/actions/notice";
import { 
    Plus, 
    Trash2, 
    Save, 
    Edit, 
    Bell, 
    Globe, 
    EyeOff, 
    Search, 
    RefreshCcw,
    FileText
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [showInScroller, setShowInScroller] = useState(true);

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        setLoading(true);
        const res = await getNotices(true); // show all
        if (res.success) {
            setNotices(res.notices);
        } else {
            toast.error("Failed to load notices");
        }
        setLoading(false);
    };

    const handleCreateNew = () => {
        setEditingId("new");
        setTitle("");
        setDescription("");
        setLink("");
        setIsActive(true);
        setShowInScroller(true);
    };

    const handleEdit = (n: any) => {
        setEditingId(n._id);
        setTitle(n.title || "");
        setDescription(n.description || "");
        setLink(n.link || "");
        setIsActive(n.isActive ?? true);
        setShowInScroller(n.showInScroller ?? true);
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            return toast.error("Title and Description are required");
        }

        const data = { title, description, link, isActive, showInScroller };
        let res;

        if (editingId === "new") {
            res = await createNotice(data);
        } else if (editingId) {
            res = await updateNotice(editingId, data);
        }

        if (res && res.success) {
            toast.success(editingId === "new" ? "Notice created successfully" : "Notice updated");
            setEditingId(null);
            loadNotices();
        } else {
            toast.error(res?.error || "Error saving notice");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;
        
        const res = await deleteNotice(id);
        if (res.success) {
            toast.success("Notice deleted");
            loadNotices();
        } else {
            toast.error(res.error || "Failed to delete");
        }
    };

    const handleToggleStatus = async (id: string, field: string, value: boolean) => {
        const res = await updateNotice(id, { [field]: value });
        if (res.success) {
            setNotices(notices.map(n => n._id === id ? { ...n, [field]: value } : n));
            toast.success("Status updated");
        }
    };

    const filteredNotices = notices.filter(n => 
        n.title.toLowerCase().includes(search.toLowerCase()) || 
        n.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Bell className="w-6 h-6" />
                        </div>
                        Manage Notices
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Publish site-wide announcements, scrolling news, and event alerts.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={loadNotices} variant="outline" size="icon" className="h-12 w-12 rounded-2xl">
                        <RefreshCcw className="w-5 h-5 text-slate-500" />
                    </Button>
                    <Button onClick={handleCreateNew} className="h-12 px-6 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-white">
                        <Plus className="w-5 h-5 mr-2" /> Publish Notice
                    </Button>
                </div>
            </div>

            {/* Editing Panel */}
            {editingId && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
                        {editingId === "new" ? "Compose New Notice" : "Edit Notice"}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notice Title / Headline</label>
                            <Input 
                                placeholder="E.g. Admissions Open for 2026 Batch" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="h-14 bg-slate-50 text-lg font-bold"
                            />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Description Details</label>
                            <Textarea 
                                placeholder="Enter the complete detailed text for the dedicated notices page..." 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                className="min-h-[120px] bg-slate-50 text-base resize-y"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Action Link (Optional URL)</label>
                            <Input 
                                placeholder="E.g. /register or https://external-link.com" 
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                className="h-12 bg-slate-50 font-mono text-sm"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 mt-2">
                            <div>
                                <p className="font-bold text-slate-900">Live Status</p>
                                <p className="text-xs text-slate-500">Is this notice currently active and visible?</p>
                            </div>
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 mt-2">
                            <div>
                                <p className="font-bold text-slate-900">Show in Scroller</p>
                                <p className="text-xs text-slate-500">Stream this headline in the homepage rolling banner?</p>
                            </div>
                            <Switch checked={showInScroller} onCheckedChange={setShowInScroller} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                        <Button onClick={handleSave} className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
                            <Save className="w-4 h-4 mr-2" /> Save & Publish
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="ghost" className="h-12 px-6 rounded-xl font-bold">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900">Published Notices Database</h3>
                    <div className="relative w-full sm:w-auto">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input 
                            placeholder="Search notices..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-slate-200 pl-10 h-12 rounded-xl w-full sm:w-80"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center text-slate-400 font-medium">Loading records...</div>
                ) : filteredNotices.length === 0 ? (
                    <div className="p-20 text-center">
                        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-lg font-bold text-slate-500">No notices found.</p>
                        <p className="text-sm text-slate-400">Click Publish Notice to create your first announcement.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredNotices.map((n) => (
                            <div key={n._id} className={`p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-slate-50/80 transition-colors ${!n.isActive && 'opacity-60 grayscale'}`}>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-black text-lg text-slate-900">{n.title}</h4>
                                        {!n.isActive && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-600 uppercase tracking-wider">Hidden</span>
                                        )}
                                        {n.showInScroller && n.isActive && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-600 uppercase tracking-wider">Scrolling</span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-2 max-w-3xl leading-relaxed">{n.description}</p>
                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
                                        <span>Posted: {new Date(n.date).toLocaleDateString()}</span>
                                        {n.link && <span className="font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded truncate max-w-xs">{n.link}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0 w-full md:w-auto">
                                    <Button 
                                        variant="outline" 
                                        title={n.showInScroller ? "Remove from Scroller" : "Add to Scroller"}
                                        onClick={() => handleToggleStatus(n._id, "showInScroller", !n.showInScroller)}
                                        className={`h-10 w-10 p-0 rounded-xl ${n.showInScroller ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-400'}`}
                                    >
                                        <Globe className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        title={n.isActive ? "Hide Notice" : "Show Notice"}
                                        onClick={() => handleToggleStatus(n._id, "isActive", !n.isActive)}
                                        className={`h-10 w-10 p-0 rounded-xl ${!n.isActive ? 'bg-rose-50 text-rose-600 border-rose-200' : 'text-emerald-500'}`}
                                    >
                                        <EyeOff className="w-4 h-4" />
                                    </Button>
                                    <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block" />
                                    <Button onClick={() => handleEdit(n)} variant="outline" className="flex-1 md:flex-none h-10 px-4 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                        <Edit className="w-4 h-4 hidden sm:block md:mr-2" /> <span className="sm:hidden md:inline">Edit</span>
                                    </Button>
                                    <Button onClick={() => handleDelete(n._id)} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-400">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
