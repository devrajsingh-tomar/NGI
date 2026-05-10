import { listBlogPosts } from "@/app/actions/blog";
import BlogSection from "@/components/public/BlogSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Insight Hub & Official Blog | NGI Study Zone",
    description: "Stay updated with the latest trends in IT, academic excellence, and career guidance from the experts at National Genius Institute.",
};

export default async function PublicBlogListPage() {
    const res = await listBlogPosts({ status: "PUBLISHED", limit: 12, page: 1 });
    const posts = res.success ? res.data.posts : [];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header Section */}
            <section className="relative overflow-hidden mb-16 px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[3rem] mx-4 lg:mx-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay rounded-[3rem] mx-4 lg:mx-10" />
                
                <div className="relative z-10 container mx-auto px-4 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 text-blue-200 font-black text-[10px] uppercase tracking-[0.3em] mb-8 backdrop-blur-xl border border-white/5">
                        The NGI Study Zone Archive
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none italic flex flex-wrap justify-center items-center gap-x-4">
                        <span className="inline-block">Knowledge</span>
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 px-2 leading-none">Synthesis</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                        Exploring the boundaries of technology, leadership, and industrial pedagogy through rigorous analysis and storytelling.
                    </p>
                </div>
            </section>

            {/* Reuse BlogSection component but with full list capability or just mapped here */}
            {/* Since BlogSection is already designed for home, we can use it or create a specific grid */}
            
            <div className="container px-6 mx-auto">
                {posts.length > 0 ? (
                    <BlogSection blogs={posts} data={{ section_name: "All Published Insights", subtitle: "Complete Archive" }} />
                ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                        <h3 className="text-2xl font-black text-slate-900 mb-4">No insights discovered yet.</h3>
                        <p className="text-slate-500 font-medium tracking-tight">Check back soon for latest technological synthesis.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
