import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingPassage from "@/models/TypingPassage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    await connectDB();

    // Recalculate wordCount if content changed
    if (data.content) {
      data.wordCount = data.content.trim().split(/\s+/).length;
    }
    // Clear bookId if empty string submitted
    if (data.bookId === "") {
      data.bookId = null;
    }

    const passage = await TypingPassage.findByIdAndUpdate(id, data, { new: true });
    
    if (!passage) {
      return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    }

    return NextResponse.json(passage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const passage = await TypingPassage.findByIdAndDelete(id);

    if (!passage) {
      return NextResponse.json({ error: "Passage not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Passage deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
