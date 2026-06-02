export const dynamic = "force-dynamic";
import { ReactNode } from "react";

import PublicNavbar from "@/components/public/PublicNavbar";
import Footer from "@/components/public/Footer";
import FloatingWidget from "@/components/public/FloatingWidget";
import { getWebsiteSettings } from "@/app/actions/settings";

export default async function PublicLayout({ children }: { children: ReactNode }) {
    const settingsRes = await getWebsiteSettings();
    const settings = settingsRes.success ? settingsRes.settings : null;

    return (
        <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <FloatingWidget settings={settings} />
        </div>
    );
}
