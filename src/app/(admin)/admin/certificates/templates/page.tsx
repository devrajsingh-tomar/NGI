
"use client";

import { useState, useEffect } from "react";
import { listTemplates, createTemplate, deleteTemplate, setDefaultTemplate, getTemplatePreviewPDF } from "@/app/actions/certificateTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, FileText, CheckCircle2, Award, Download, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewingId, setPreviewingId] = useState<string | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        const res = await listTemplates();
        if (res.success) setTemplates(res.templates);
    };

    const handlePreview = async (templateId: string) => {
        setPreviewingId(templateId);
        try {
            const res = await getTemplatePreviewPDF(templateId);
            if (res.success && res.pdfBase64) {
                const byteCharacters = atob(res.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = res.filename || "template-preview.pdf";
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Preview generated successfully!");
            } else {
                toast.error(res.error || "Preview failed");
            }
        } catch (error) {
            toast.error("Error generating preview");
        } finally {
            setPreviewingId(null);
        }
    };

    const handleCreate = async () => {
        if (!newTemplateName) return;
        setIsCreating(true);
        const res = await createTemplate({ name: newTemplateName });
        setIsCreating(false);

        if (res.success) {
            toast.success("Template created");
            setNewTemplateName("");
            setIsDialogOpen(false);
            loadTemplates();
        } else {
            console.error(res.error);
            toast.error(res.error || "Failed to create template");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete template "${name}"? This action cannot be undone.`)) return;
        const res = await deleteTemplate(id);
        if (res.success) {
            toast.success("Template deleted permanently");
            loadTemplates();
        } else {
            toast.error(res.error || "Failed to delete template");
        }
    };

    const handleSetDefault = async (id: string) => {
        const res = await setDefaultTemplate(id);
        if (res.success) {
            toast.success("System default template updated!", {
                description: "New certificates will now use this layout by default."
            });
            loadTemplates();
        } else {
            toast.error("Failed to set default template");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Award className="w-8 h-8 text-indigo-600" /> Template Forge
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Design, preview, and deploy institutional diploma layouts.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-2xl font-bold bg-slate-900 text-white border-none shadow-xl shadow-slate-900/10">
                            <Plus className="w-4 h-4 mr-2" /> Create Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-none p-8">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-slate-900">New Template Blueprint</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Template Identity Name</label>
                                <Input
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    placeholder="e.g. Platinum Graduation Layout"
                                    className="h-12 rounded-xl border-slate-200"
                                />
                            </div>
                            <Button onClick={handleCreate} disabled={isCreating} className="w-full h-14 rounded-2xl text-lg font-black bg-primary">
                                {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : "Bootstrap Template"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <Card key={template._id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2.5rem] bg-white overflow-hidden border border-slate-100">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg font-black text-slate-800 tracking-tight">{template.name}</span>
                                </div>
                                {template.isDefault && (
                                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.1em] font-black border border-emerald-100/50 shadow-sm">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Default
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[1.414/1] bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 text-sm relative overflow-hidden group/canvas ring-1 ring-slate-100 transition-all">
                                {template.backgroundImage ? (
                                    <img src={template.backgroundImage} className="w-full h-full object-cover opacity-30 grayscale group-hover/canvas:grayscale-0 transition-all duration-500" alt="preview" />
                                ) : (
                                    <Award className="w-12 h-12 text-slate-200" />
                                )}
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Elements</span>
                                        <span className="text-sm font-black text-slate-900">{template.elements?.length || 0}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Layout</span>
                                        <span className="text-sm font-black text-slate-900 uppercase">{template.config?.orientation || 'A4'}</span>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handlePreview(template._id)} 
                                    className="rounded-full h-10 px-4 font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 gap-2 border border-transparent hover:border-indigo-100"
                                    disabled={previewingId === template._id}
                                >
                                    {previewingId === template._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                                    Live Preview
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 p-6 bg-slate-50/50 border-t border-slate-100">
                            <div className="flex justify-between w-full gap-3">
                                <Link href={`/admin/certificates/templates/${template._id}/edit`} className="flex-1">
                                    <Button className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-slate-900 hover:bg-slate-900 hover:text-white border-2 border-slate-100 shadow-sm transition-all shadow-none">
                                        <Edit className="w-4 h-4 mr-2" /> Design System
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border-2 border-transparent hover:border-rose-100 transition-all shrink-0"
                                    onClick={() => handleDelete(template._id, template.name)}
                                >
                                    <Trash className="w-5 h-5" />
                                </Button>
                            </div>
                            
                            {!template.isDefault && (
                                <Button 
                                    className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all" 
                                    size="sm"
                                    onClick={() => handleSetDefault(template._id)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Deploy As System Default
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

