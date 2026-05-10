"use server";

import { upsertBlogPost } from "@/app/actions/blog";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { redirect } from "next/navigation";

export default async function NewBlogPostPage() {
    const handleSave = async (data: any) => {
        "use server";
        const res = await upsertBlogPost(data);
        if (res.success) {
            redirect("/admin/blogs");
        }
        return res;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <BlogEditor onSave={handleSave} />
        </div>
    );
}

