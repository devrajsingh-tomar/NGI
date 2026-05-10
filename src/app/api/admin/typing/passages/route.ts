import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingPassage from "@/models/TypingPassage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const passages = await TypingPassage.find().sort({ createdAt: -1 });
    return NextResponse.json(passages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch passages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    // Auto calculate word count
    const wordCount = data.content.trim().split(/\s+/).length;
    
    // Clear bookId if empty string submitted
    if (data.bookId === "") {
      data.bookId = null;
    }
    
    const passage = await TypingPassage.create({
      ...data,
      wordCount
    });

    return NextResponse.json({ success: true, passage: passage.toObject() }, { status: 201 });
  } catch (error: any) {
    console.error("Passage Creation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create passage" }, { status: 500 });
  }
}
