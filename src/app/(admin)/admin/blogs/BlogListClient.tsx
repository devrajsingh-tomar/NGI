"use client";

import { useState } from "react";
import { 
    Eye, Edit3, Trash2, Calendar, 
    MoreHorizontal, ChevronRight,
    TrendingUp, CheckCircle2, 
    AlertCircle, Globe, MoreVertical,
    Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { deleteBlogPost } from "@/app/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BlogListClient({ posts }: { posts: any[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
        
        setDeletingId(id);
        const res = await deleteBlogPost({ id });
        if (res.success) {
            toast.success("Post deleted successfully");
            router.refresh();
        } else {
            toast.error(res.error);
        }
        setDeletingId(null);
    };

    if (posts.length === 0) {
        return (
            <div className="py-20 text-center space-y-6 flex flex-col items-center animate-in fade-in duration-500">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Edit3 className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 leading-none">Your Pen is Idle</h3>
                      <p className="text-slate-500 font-medium">No articles found matching your current filter.</p>
                 </div>
                 <Link href="/admin/blogs/new">
                      <Button className="rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest gap-2">
                           Start Writing
                      </Button>
                 </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, idx) => (
                <div 
                    key={post._id}
                    className={cn(
                        "group bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col relative animate-in fade-in slide-in-from-bottom-2",
                        deletingId === post._id && "opacity-50 pointer-events-none scale-95"
                    )}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    {/* Status Ribbon */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                         <Badge className={cn(
                             "text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 border-none shadow-sm",
                             post.status === 'PUBLISHED' ? "bg-emerald-500 text-white" : post.status === 'DRAFT' ? "bg-amber-500 text-white" : "bg-slate-400 text-white"
                         )}>
                             {post.status}
                         </Badge>
                    </div>

                    {/* SEO Performance Indicator */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                         <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-sm text-[9px] md:text-[10px] font-black italic">
                              <Target className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />
                              SEO 94%
                         </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                         {post.thumbnail ? (
                             <Image 
                                 src={post.thumbnail} 
                                 alt={post.title} 
                                 fill 
                                 className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                             />
                         ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-950">
                                  <Globe className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-20" />
                                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">No Featured Image</p>
                             </div>
                         )}
                         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                         
                         {/* Author Overlay */}
                         <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-2">
                             <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-white text-[9px] md:text-[10px] font-black">
                                  {post.author?.name?.charAt(0) || "A"}
                             </div>
                             <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest leading-none drop-shadow-md">{post.author?.name || "Anonymous Admin"}</p>
                         </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4">
                             <h4 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                 {post.title}
                             </h4>
                             <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3 italic">
                                 {post.excerpt || "No summary provided for this high-performance content."}
                             </p>
                        </div>

                        <div className="mt-auto space-y-6 pt-6 border-t border-slate-50">
                             <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <Calendar className="w-4 h-4" />
                                       </div>
                                       <div className="leading-none">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Updated At</p>
                                            <p className="text-[11px] font-black text-slate-700">{new Date(post.updatedAt).toLocaleDateString()}</p>
                                       </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                       <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                       <span className="text-lg font-black text-slate-900">{post.viewCount || 0}</span>
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hits</span>
                                  </div>
                             </div>

                             <div className="flex items-center gap-3">
                                  <Link href={`/admin/blogs/edit/${post._id}`} className="flex-1">
                                       <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
                                            <Edit3 className="w-4 h-4" /> Manage Post
                                       </Button>
                                  </Link>
                                  
                                  <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 p-0">
                                                 <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 p-2 shadow-2xl">
                                            <DropdownMenuItem className="rounded-xl h-11 px-4 gap-3 text-slate-600 font-bold focus:bg-slate-50 focus:text-primary transition-all">
                                                 <Eye className="w-4 h-4" /> Preview Live
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl h-11 px-4 gap-3 text-slate-600 font-bold focus:bg-slate-50 focus:text-primary transition-all">
                                                 <Globe className="w-4 h-4" /> Force Re-index
                                            </DropdownMenuItem>
                                            <div className="h-px bg-slate-50 my-2 mx-2" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDelete(post._id, post.title)}
                                                className="rounded-xl h-11 px-4 gap-3 text-red-500 font-bold focus:bg-red-50 focus:text-red-600 transition-all"
                                            >
                                                 <Trash2 className="w-4 h-4" /> Archive Post
                                            </DropdownMenuItem>
                                       </DropdownMenuContent>
                                  </DropdownMenu>
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

