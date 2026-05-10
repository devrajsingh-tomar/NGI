import { Suspense } from "react";
import VerifyContent from "./VerifyContent";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";


export default function VerifyAttendancePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Verifying...</p>
                </div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
