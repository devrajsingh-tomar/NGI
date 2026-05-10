"use client";

import { useState, useEffect, useRef } from "react";
import { 
    Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, 
    List, ListOrdered, Heading1, Heading2, Heading3, 
    ChevronRight, Save, Globe, Eye, MoreVertical, 
    ChevronDown, 
    Info,
    CheckCircle2,
    AlertCircle,
    Search,
    Type,
    FileText,
    Share2,
    BarChart3,
    ArrowUpRight,
    TrendingUp,
    Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SEOAssistant from "./SEOAssistant";
import SEOPreview from "./SEOPreview";

interface BlogEditorProps {
    initialData?: any;
    onSave: (data: any) => Promise<any>;
}

export default function BlogEditor({ initialData, onSave }: BlogEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
    const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
    const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
    const [status, setStatus] = useState(initialData?.status || "DRAFT");
    const [category, setCategory] = useState(initialData?.category || "");
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
    
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData?.id && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    }, [title, initialData?.id]);

    // Initialize editor content only once
    useEffect(() => {
        if (editorRef.current && initialData?.content) {
            editorRef.current.innerHTML = initialData.content;
            setContent(initialData.content);
        }
    }, []);

    const handleCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    const handleSave = async (published: boolean = false) => {
        setIsSaving(true);
        try {
            const data = {
                id: initialData?.id,
                title,
                slug,
                content: editorRef.current?.innerHTML || content,
                focusKeyword,
                metaTitle: metaTitle || title,
                metaDescription,
                excerpt,
                thumbnail,
                status: published ? "PUBLISHED" : status,
                category,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean)
            };
            
            const res = await onSave(data);
            if (res && res.success === false) {
                toast.error(res.error || "Failed to save post");
                return;
            }
            
            toast.success(published ? "Post Published!" : "Changes Saved");
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 min-h-screen bg-slate-50/30 p-2 md:p-0">
            {/* Main Editor Section */}
            <div className="flex-1 space-y-6 md:space-y-10">
                {/* Top Actions */}
                <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <Layout className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                             <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Post Editor</h1>
                             <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Storytelling & SEO Ecosystem</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                         <div className="flex gap-2 flex-1 md:flex-none">
                            <Button variant="ghost" className="rounded-xl h-10 md:h-12 px-3 md:px-6 font-black text-[10px] uppercase tracking-widest gap-2 flex-1">
                                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
                            </Button>
                            <Button 
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                variant="outline" 
                                className="rounded-xl h-10 md:h-12 px-3 md:px-6 font-black text-[10px] uppercase tracking-widest gap-2 bg-white border-slate-100 flex-1"
                            >
                                <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
                            </Button>
                         </div>
                         <Button 
                             onClick={() => handleSave(true)}
                             disabled={isSaving}
                             className="rounded-xl h-10 md:h-12 px-6 md:px-8 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 w-full md:w-auto"
                         >
                             <Globe className="w-4 h-4" /> Publish Post
                         </Button>
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] md:min-h-[700px] flex flex-col">
                    <div className="px-5 md:px-10 pt-6 md:pt-10 pb-4">
                         <input 
                            type="text" 
                            placeholder="Enter post title..." 
                            className="w-full text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 placeholder:text-slate-100 border-none outline-none tracking-tight mb-2 md:mb-4"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                         />
                         <div className="flex flex-wrap items-center gap-2 text-slate-400 font-bold mb-6 md:mb-8">
                             <span className="text-[10px] md:text-xs">@ yoursite.com/blog/</span>
                             <span className="text-[10px] md:text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10 break-all">{slug || 'post-slug'}</span>
                         </div>

                         {/* Custom Toolbar */}
                         <div className="flex flex-wrap items-center gap-1 p-1 md:p-2 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 mb-4 md:mb-6">
                             {[
                                 { cmd: 'bold', icon: Bold },
                                 { cmd: 'italic', icon: Italic },
                                 { cmd: 'underline', icon: Underline },
                                 { cmd: 'insertUnorderedList', icon: List },
                                 { cmd: 'insertOrderedList', icon: ListOrdered },
                                 { cmd: 'formatBlock', val: 'H1', icon: Heading1 },
                                 { cmd: 'formatBlock', val: 'H2', icon: Heading2 },
                                 { cmd: 'formatBlock', val: 'H3', icon: Heading3 },
                                 { cmd: 'createLink', icon: LinkIcon, prompt: 'Enter URL' },
                                 { cmd: 'insertImage', icon: ImageIcon, prompt: 'Enter Image URL' },
                             ].map((tool, i) => (
                                 <button
                                     key={i}
                                     type="button"
                                     onClick={() => {
                                         if (tool.prompt) {
                                             const val = prompt(tool.prompt);
                                             if (val) handleCommand(tool.cmd, val);
                                         } else {
                                             handleCommand(tool.cmd, tool.val);
                                         }
                                     }}
                                     className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-primary transition-all"
                                 >
                                     <tool.icon className="w-4.5 h-4.5" />
                                 </button>
                             ))}
                         </div>
                    </div>

                    <div className="flex-1 px-5 md:px-10 pb-6 md:pb-10">
                         <div 
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => setContent(e.currentTarget.innerHTML)}
                            onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                            className="w-full h-full min-h-[400px] outline-none prose prose-slate max-w-none text-slate-700 text-base md:text-lg leading-relaxed placeholder:text-slate-200"
                         />
                    </div>
                </div>

                {/* Post Settings & SEO Section */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                             <BarChart3 className="w-5 h-5 text-indigo-500" />
                             <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Post Settings & SEO</h3>
                        </div>
                        <ChevronDown className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="p-5 md:p-10 space-y-8 md:space-y-10">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="space-y-3 md:space-y-4">
                                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Search className="w-3.5 h-3.5" /> Focus Keyword
                                </p>
                                <Input 
                                    placeholder="e.g. react tutorial" 
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 focus:ring-primary/20"
                                    value={focusKeyword}
                                    onChange={(e) => setFocusKeyword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5" /> Category
                                </p>
                                <Input 
                                    placeholder="Select category" 
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 focus:ring-primary/20"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                         </div>

                         <div className="space-y-3 md:space-y-4">
                            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Type className="w-3.5 h-3.5" /> Meta Title
                            </p>
                            <Input 
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                placeholder="SEO title for search results" 
                                className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 focus:ring-primary/20 font-bold"
                            />
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] text-slate-400 font-bold italic hidden sm:block">Recommended: 50-60</p>
                                <p className={cn("text-[10px] font-black ml-auto", metaTitle.length > 60 ? "text-red-500" : "text-slate-400")}>
                                    {metaTitle.length}/60
                                </p>
                            </div>
                         </div>

                         <div className="space-y-3 md:space-y-4">
                            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> Meta Description
                            </p>
                            <textarea 
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="Brief description for search results..." 
                                className="w-full min-h-[100px] md:min-h-[120px] p-4 md:p-6 rounded-xl md:rounded-[1.5rem] border border-slate-100 outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50/30 text-slate-700 font-medium leading-relaxed resize-none transition-all text-sm md:text-base"
                            />
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] text-slate-400 font-bold italic hidden sm:block">Recommended: 150-160</p>
                                <p className={cn("text-[10px] font-black ml-auto", metaDescription.length > 160 ? "text-red-500" : "text-slate-400")}>
                                    {metaDescription.length}/160
                                </p>
                            </div>
                         </div>

                         <div className="space-y-3 md:space-y-4">
                            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ArrowUpRight className="w-3.5 h-3.5" /> Excerpt
                            </p>
                            <textarea 
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Short summary for feeds..." 
                                className="w-full min-h-[80px] p-4 md:p-6 rounded-xl md:rounded-[1.5rem] border border-slate-100 outline-none focus:ring-2 focus:ring-primary/20 bg-white text-slate-700 font-medium leading-relaxed resize-none text-sm md:text-base"
                            />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="space-y-3 md:space-y-4">
                                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Share2 className="w-3.5 h-3.5" /> Tags
                                </p>
                                <Input 
                                    placeholder="react, javascript, web" 
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 focus:ring-primary/20"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Featured Image URL
                                </p>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="https://..." 
                                        className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 focus:ring-primary/20 flex-1"
                                        value={thumbnail}
                                        onChange={(e) => setThumbnail(e.target.value)}
                                    />
                                    <Button className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200 text-[10px] md:text-xs font-black uppercase">
                                        Upload
                                    </Button>
                                </div>
                            </div>
                         </div>

                         <div className="pt-6 md:pt-10 border-t border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Google Search Preview</p>
                             <div className="overflow-hidden">
                                <SEOPreview 
                                    title={metaTitle || title}
                                    slug={slug}
                                    description={metaDescription}
                                />
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: SEO & Readability */}
            <div className="w-full lg:w-96 space-y-8 h-fit lg:sticky lg:top-8">
                <SEOAssistant 
                    content={content}
                    title={title}
                    keyword={focusKeyword}
                    metaTitle={metaTitle}
                    metaDesc={metaDescription}
                />
            </div>
        </div>
    );
}

