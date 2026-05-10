import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WordSet from "@/models/WordSet";

export async function GET() {
  try {
    await connectDB();
    const sets = await WordSet.find().sort({ createdAt: -1 });
    return NextResponse.json(sets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch word sets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const set = await WordSet.create(data);
    return NextResponse.json(set);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create word set" }, { status: 500 });
  }
}
