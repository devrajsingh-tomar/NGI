"use client";

import { Globe, MoreVertical, Search, MousePointer2 } from "lucide-react";

interface SEOPreviewProps {
    title: string;
    slug: string;
    description: string;
}

export default function SEOPreview({ title, slug, description }: SEOPreviewProps) {
    const displayTitle = title || "Post Title";
    const displaySlug = slug || "your-post-slug";
    const displayDesc = description || "Add a meta description to see how your post will appear in Google search results. A well-crafted description can significantly increase your click-through rate.";

    return (
        <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner group relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
             
             <div className="flex flex-col gap-6 max-w-2xl">
                 <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
                           <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                           <p className="text-[11px] font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">Google Preview</p>
                           <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Live simulation</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Optimized</span>
                      </div>
                 </div>

                 {/* Google Result Box */}
                 <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100/50 space-y-3 relative overflow-hidden group/box">
                      <div className="flex items-center gap-3 mb-2">
                          <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 italic font-serif text-[10px] text-slate-400">
                               N
                          </div>
                          <div className="flex flex-col">
                               <p className="text-[11px] font-bold text-slate-600 leading-none">yoursite.com</p>
                               <p className="text-[10px] text-primary/80 font-medium leading-none mt-1">/blog/{displaySlug}</p>
                          </div>
                          <MoreVertical className="w-4 h-4 ml-auto text-slate-300 group-hover/box:text-slate-400 transition-colors" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-[#1a0dab] leading-tight group-hover/box:underline truncate">
                          {displayTitle}
                      </h3>
                      
                      <p className="text-[14px] leading-relaxed text-[#4d5156] font-medium line-clamp-2">
                          {displayDesc}
                      </p>
                 </div>

                 <div className="flex items-center gap-6 pt-4 px-4 opacity-40">
                      <div className="flex items-center gap-2">
                           <Search className="w-3 h-3" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Search Engine Friendly</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <MousePointer2 className="w-3 h-3" />
                           <span className="text-[10px] font-black uppercase tracking-widest">High Click Probability</span>
                      </div>
                 </div>
             </div>
        </div>
    );
}

