import CertificateVerificationSection from "@/components/public/CertificateVerificationSection";
import { ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Verify Certificate | NGI Study Zone",
    description: "Verify authentic academic certificates and digital credentials issued by NGI Study Zone Institute."
};

export default function VerifyIndexPage() {
    return (
        <div className="min-h-[80vh] flex flex-col pt-24 pb-12 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background for Public Page Wrapper */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />
            
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                
                {/* Embedded Verification Component */}
                <div className="w-full max-w-5xl mx-auto">
                    <CertificateVerificationSection />
                </div>
                
                {/* Official Stamp */}
                <div className="mt-8 text-center flex flex-col items-center opacity-50">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 max-w-sm">
                        NGI Study Zone Central Credentialing Authority. System uses live cryptographically secured database links.
                    </p>
                </div>
            </div>
        </div>
    );
}
