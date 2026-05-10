import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GovExam from "@/models/GovExam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await GovExam.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const exam = await GovExam.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(exam);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
