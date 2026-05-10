export const dynamic = "force-dynamic";
import { ReactNode } from "react";

import PublicNavbar from "@/components/public/PublicNavbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <PublicNavbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
