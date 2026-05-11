import AdminTypingDashboard from "@/components/admin/typing/AdminTypingDashboard";
import { isTypingModuleEnabled } from "@/lib/feature-flags";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Typing Manager | Admin",
};

export default function AdminTypingPage() {
  const isEnabled = isTypingModuleEnabled();

  if (!isEnabled) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8 max-w-lg">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Module Locked</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              The Typing Management Suite is currently disabled via the system environment configuration.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Status: NEXT_PUBLIC_ENABLE_TYPING_MODULE = false
          </div>
          <Link href="/admin" className="block">
            <button className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Return to Command Center
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <AdminTypingDashboard />;
}
