"use server";

import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import Answer from "@/models/Answer";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getQuizAnalytics(quizId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const quiz = await Quiz.findById(quizId).populate("courseId", "title").lean();
        if (!quiz) return { success: false, error: "Quiz not found" };

        const attempts = await Attempt.find({ quizId })
            .populate({ path: "studentId", select: "name email" })
            .sort({ totalScore: -1 })
            .lean();

        // High Level Stats
        const totalAttempts = attempts.length;
        const passCount = attempts.filter((a: any) => a.isPassed).length;
        const passRate = totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0;

        let totalScoreSum = 0;
        let highestScore = 0;
        let lowestScore = Infinity;

        attempts.forEach((a: any) => {
            totalScoreSum += a.totalScore;
            if (a.totalScore > highestScore) highestScore = a.totalScore;
            if (a.totalScore < lowestScore) lowestScore = a.totalScore;
        });

        if (lowestScore === Infinity) lowestScore = 0;
        const averageScore = totalAttempts > 0 ? totalScoreSum / totalAttempts : 0;

        // Security Violations
        const totalTabSwitches = attempts.reduce((acc, a: any) => acc + (a.securityLogs?.tabSwitchCount || 0), 0);

        return {
            success: true,
            quiz: JSON.parse(JSON.stringify(quiz)),
            attempts: JSON.parse(JSON.stringify(attempts)),
            stats: {
                totalAttempts,
                passRate,
                highestScore,
                lowestScore,
                averageScore,
                totalTabSwitches
            }
        };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
