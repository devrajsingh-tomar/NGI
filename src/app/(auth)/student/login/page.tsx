import StudentLoginForm from "@/components/auth/StudentLoginForm";
import { Suspense } from "react";

export default function StudentLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <StudentLoginForm />
        </Suspense>
    );
}
