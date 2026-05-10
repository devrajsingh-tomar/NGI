import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingCategory from "@/models/TypingCategory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const categories = await TypingCategory.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
