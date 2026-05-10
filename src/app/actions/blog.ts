"use server";

import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { createSafeAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Zod Schema for Blog Post data
const BlogPostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, "Title too short").max(200),
    slug: z.string().min(3, "Slug too short").toLowerCase(),
    content: z.string().min(10, "Content too short"),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    
    // SEO Meta
    focusKeyword: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

// CREATE / UPDATE Blog Post
export const upsertBlogPost = createSafeAction(
    {
        schema: BlogPostSchema,
        roles: ["ADMIN"],
        requireAuth: true,
    },
    async (data, session) => {
        await connectDB();
        const { id, ...postData } = data;
        
        let blog;
        if (id) {
            blog = await BlogPost.findByIdAndUpdate(
                id,
                { ...postData },
                { new: true, runValidators: true }
            );
            if (!blog) throw new Error("Blog post not found");
        } else {
            // Check if slug exists
            const existing = await BlogPost.findOne({ slug: postData.slug });
            if (existing) throw new Error("A post with this slug already exists.");
            
            blog = await BlogPost.create({
                ...postData,
                author: session.user.id
            });
        }
        
        // Final revalidation
        revalidatePath("/", "layout");
        revalidatePath("/(public)");
        revalidatePath("/admin/blogs");
        
        return JSON.parse(JSON.stringify(blog));
    }
);

// GET Single Blog Post
export const getBlogPost = createSafeAction(
    {
        schema: z.object({ id: z.string().optional(), slug: z.string().optional() }),
        roles: ["ANY"],
        requireAuth: false,
    },
    async (data) => {
        await connectDB();
        const query = data.id ? { _id: data.id } : { slug: data.slug };
        const blog = await BlogPost.findOne(query).populate("author", "name").lean();
        if (!blog) throw new Error("Post not found");
        return JSON.parse(JSON.stringify(blog));
    }
);

// LIST Blog Posts
export const listBlogPosts = createSafeAction(
    {
        schema: z.object({ 
            status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "ALL"]).default("ALL"),
            limit: z.number().optional().default(20),
            page: z.number().optional().default(1)
        }),
        roles: ["ANY"], 
        requireAuth: false,
    },
    async (data) => {
        await connectDB();
        const filter: any = {};
        if (data.status !== "ALL") filter.status = data.status;
        
        const skip = (data.page - 1) * data.limit;
        const posts = await BlogPost.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(data.limit)
            .populate("author", "name")
            .lean();
            
        const total = await BlogPost.countDocuments(filter);
        
        return {
            posts: JSON.parse(JSON.stringify(posts)),
            total,
            pages: Math.ceil(total / data.limit)
        };
    }
);

// DELETE Blog Post
export const deleteBlogPost = createSafeAction(
    {
        schema: z.object({ id: z.string() }),
        roles: ["ADMIN"],
        requireAuth: true,
    },
    async ({ id }) => {
        await connectDB();
        const blog = await BlogPost.findByIdAndDelete(id);
        if (!blog) throw new Error("Not found");
        
        revalidatePath("/", "layout");
        revalidatePath("/admin/blogs");
        return { success: true };
    }
);
