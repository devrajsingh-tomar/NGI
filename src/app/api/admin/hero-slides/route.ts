import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

// GET — admin list (all slides, ordered)
export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(slides);
  } catch {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

// POST — create new slide
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const slide = await HeroSlide.create(body);
    return NextResponse.json(slide, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create slide" }, { status: 500 });
  }
}
