"use server";

import { getBlogPost, upsertBlogPost } from "@/app/actions/blog";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { redirect, notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: any }) {
    const { id } = await params;
    
    // Fetch initial data
    const res = await getBlogPost({ id });
    if (!res.success) {
        notFound();
    }
    
    const blog = res.data;

    const handleSave = async (updateData: any) => {
        "use server";
        const res = await upsertBlogPost({ ...updateData, id });
        if (res.success) {
            redirect("/admin/blogs");
        }
        return res;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <BlogEditor initialData={blog} onSave={handleSave} />
        </div>
    );
}

