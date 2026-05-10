import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    thumbnail?: string;
    category?: string;
    tags?: string[];
    
    // SEO Fields
    focusKeyword?: string;
    metaTitle?: string;
    metaDescription?: string;
    
    // Status & Metadata
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    author: mongoose.Types.ObjectId;
    publishedAt?: Date;
    viewCount: number;
    
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true, trim: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        thumbnail: { type: String },
        category: { type: String },
        tags: [{ type: String }],
        
        focusKeyword: { type: String },
        metaTitle: { type: String },
        metaDescription: { type: String },
        
        status: { 
            type: String, 
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
            default: 'DRAFT' 
        },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        publishedAt: { type: Date },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Indexes for search and sorting
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
