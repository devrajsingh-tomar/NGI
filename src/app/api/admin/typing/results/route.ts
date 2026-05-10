import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingResult from "@/models/TypingResult";
import "@/models/TypingExam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");
    
    await connectDB();
    const query = examId ? { examId } : {};
    
    const results = await TypingResult.find(query)
      .populate("userId", "name email")
      .populate("examId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
