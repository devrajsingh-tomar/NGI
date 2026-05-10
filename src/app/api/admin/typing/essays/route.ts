import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PracticeEssay from "@/models/PracticeEssay";

export async function GET() {
  try {
    await connectDB();
    const essays = await PracticeEssay.find().sort({ topic: 1 });
    return NextResponse.json(essays);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch essays" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const essay = await PracticeEssay.create(data);
    return NextResponse.json(essay);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create essay" }, { status: 500 });
  }
}
