"use client";

import { useState } from "react";
import { ReactNode } from "react";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentNavbar from "@/components/student/StudentNavbar";

export default function StudentLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            {/* Sidebar — always visible on lg, drawer on mobile */}
            <StudentSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
                <StudentNavbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth bg-transparent">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
