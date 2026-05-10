import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingBook from "@/models/TypingBook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const books = await TypingBook.find().sort({ name: 1 });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
