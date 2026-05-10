"use server";

import { listBlogPosts } from "@/app/actions/blog";
import { 
    Plus, Search, Filter, MoreVertical, 
    Calendar, Eye, MessageSquare, Edit3, 
    Trash2, Globe, FileText, TrendingUp,
    Layout, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlogListClient from "./BlogListClient";

export default async function AdminBlogsPage({ searchParams }: { searchParams: any }) {
    const params = await searchParams;
    const status = params.status || "ALL";
    const page = Number(params.page) || 1;
    
    const res = await listBlogPosts({ status, page, limit: 12 });
    const { posts, total, pages } = res.success ? res.data : { posts: [], total: 0, pages: 1 };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                     <div className="w-16 h-16 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                          <FileText className="w-8 h-8" />
                     </div>
                     <div>
                          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Content Hub & Blogs</h1>
                          <div className="flex items-center gap-4 mt-4">
                               <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Total Articles: <span className="text-slate-900">{total}</span>
                               </div>
                               <span className="w-1 h-1 rounded-full bg-slate-200" />
                               <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Global Reach: Optimized</div>
                          </div>
                     </div>
                </div>
                <div className="relative z-10">
                     <Link href="/admin/blogs/new">
                          <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/95 text-white font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
                               <Plus className="w-5 h-5" /> Write New Article
                          </Button>
                     </Link>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatCard label="Published" val={posts.filter((p: any) => p.status === 'PUBLISHED').length} color="text-emerald-500" icon={Globe} />
                <StatCard label="Drafts" val={posts.filter((p: any) => p.status === 'DRAFT').length} color="text-amber-500" icon={Clock} />
                <StatCard label="Archived" val={posts.filter((p: any) => p.status === 'ARCHIVED').length} color="text-slate-400" icon={AlertCircle} />
                <StatCard label="SEO Performance" val="92%" color="text-primary" icon={TrendingUp} />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                     <div className="flex-1 max-w-lg relative">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input 
                               placeholder="Search articles, keywords or categories..." 
                               className="w-full h-14 pl-16 pr-6 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-medium transition-all"
                          />
                     </div>
                     <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-inner">
                          {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map(s => (
                               <Link 
                                    key={s} 
                                    href={`/admin/blogs?status=${s}`}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        status === s ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                               >
                                    {s}
                               </Link>
                          ))}
                     </div>
                </div>

                <div className="flex-1 p-10">
                    <BlogListClient posts={posts} />
                </div>
                
                {pages > 1 && (
                    <div className="p-8 border-t border-slate-50 flex items-center justify-center gap-4">
                        <Button variant="outline" className="h-12 rounded-xl border-slate-100">Previous</Button>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Page {page} of {pages}</span>
                        <Button variant="outline" className="h-12 rounded-xl border-slate-100">Next</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, val, color, icon: Icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
            </div>
            <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{val}</p>
            </div>
        </div>
    );
}
