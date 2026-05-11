import TypingSelectionLayer from "@/components/typing/TypingSelectionLayer";
import { isTypingModuleEnabled } from "@/lib/feature-flags";

export const metadata = {
  title: "Typing Practice | National Genius Institute",
  description: "Select your practice module and improve your typing speed.",
};

export default function TypingPage() {
  const isEnabled = isTypingModuleEnabled();

  if (!isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20 px-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8">
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">System <span className="text-primary not-italic">Offline</span></h2>
            <p className="text-slate-500 font-bold mt-4 leading-relaxed">
              The Typing Examination Portal is currently undergoing scheduled maintenance or is restricted by administrator protocols.
            </p>
          </div>
          <a href="/" className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all">
            Return to Headquarters
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <TypingSelectionLayer />
    </div>
  );
}
