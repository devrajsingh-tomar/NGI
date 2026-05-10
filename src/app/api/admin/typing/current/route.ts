import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CurrentPassage from "@/models/CurrentPassage";

export async function GET() {
  try {
    await connectDB();
    const passages = await CurrentPassage.find().sort({ date: -1 });
    return NextResponse.json(passages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch current passages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const passage = await CurrentPassage.create(data);
    return NextResponse.json(passage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create passage" }, { status: 500 });
  }
}
