import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

// Public GET — only active slides ordered correctly
export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json(slides, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}
