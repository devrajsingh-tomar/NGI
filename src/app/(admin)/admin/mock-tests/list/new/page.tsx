import AdminQuizWizard from "@/components/admin/quizzes/AdminQuizWizard";
import { getAllCourses } from "@/app/actions/courses";
import { getQuestions } from "@/app/actions/questions";

export const dynamic = "force-dynamic";

export default async function NewQuizPage() {
    const [coursesRes, questionsRes] = await Promise.all([
        getAllCourses(),
        getQuestions()
    ]);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-6">Create New Exam</h1>
            <AdminQuizWizard
                courses={coursesRes.courses || []}
                questionBank={questionsRes.questions || []}
            />
        </div>
    );
}
