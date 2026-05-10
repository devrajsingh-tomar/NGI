import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

// PATCH — update a slide
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true });
    if (!slide) return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    return NextResponse.json(slide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a slide
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
