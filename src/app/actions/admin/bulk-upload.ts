"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseExcelQuestions, generateSampleTemplate } from "@/lib/excel-helper";
import { bulkInsertQuestions } from "@/app/actions/questions";
import { revalidatePath } from "next/cache";

export async function processExcelUpload(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file uploaded" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const { questions, errors } = await parseExcelQuestions(buffer);

    if (questions.length === 0 && errors.length > 0) {
      return { 
        success: false, 
        error: "All rows failed validation", 
        details: { successCount: 0, failedCount: errors.length, errors } 
      };
    }

    // Since courseId is required in Question model, we need to handle it.
    // For now, I'll assume the admin selects a default course or we use a fallback.
    // Let's check if the user provided a courseId in the form.
    const courseId = formData.get("courseId")?.toString();
    if (!courseId) return { success: false, error: "Course ID is required" };

    const questionsWithCourse = questions.map(q => ({ ...q, courseId }));

    const res = await bulkInsertQuestions(questionsWithCourse);
    
    if (res.success) {
      return { 
        success: true, 
        details: { 
          successCount: res.count, 
          failedCount: errors.length, 
          errors 
        } 
      };
    } else {
      return { success: false, error: res.error };
    }
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function downloadTemplate() {
  try {
    const buffer = await generateSampleTemplate();
    // In server actions, we can't easily return a file for download directly.
    // We'll return the base64 string or the user can use a regular API route.
    // For simplicity, I'll provide an API route for this later.
    return { success: true, buffer: Buffer.from(buffer as ArrayBuffer).toString("base64") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
