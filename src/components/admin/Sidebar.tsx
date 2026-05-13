"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Shapes,
    Library,
    Users,
    CreditCard,
    Settings,
    Image as ImageIcon,
    Calendar,
    GraduationCap,
    ClipboardList,
    Layout,
    ChevronDown,
    BrainCircuit,
    Bell,
    Video,
    Keyboard,
    MonitorPlay
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuGroups = [
    {
        groupLabel: "Overview",
        items: [
            { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ]
    },
    {
        groupLabel: "Academic Core",
        items: [
            { label: "Courses & LMS", href: "/admin/courses", icon: Shapes },
            { label: "Study Materials", href: "/admin/materials", icon: Library },
            { label: "Faculty & Staff", href: "/admin/faculty", icon: GraduationCap },
        ]
    },
    {
        groupLabel: "Assessments",
        items: [
            {
                label: "Mock Test Engine",
                href: "/admin/mock-tests",
                icon: BrainCircuit,
                subItems: [
                    { label: "Dashboard", href: "/admin/mock-tests" },
                    { label: "Question Bank", href: "/admin/mock-tests/questions" },
                    { label: "Paper Sets", href: "/admin/mock-tests/papers" },
                    { label: "Live Exams", href: "/admin/mock-tests/list" },
                    { label: "Paid Requests", href: "/admin/mock-tests/requests" },
                    { label: "Student Results", href: "/admin/results" },
                    { label: "Analytics", href: "/admin/mock-tests/analytics" }
                ]
            },

            { label: "Certificates", href: "/admin/certificates", icon: GraduationCap },
        ]
    },
    {
        groupLabel: "Student Affairs",
        items: [
            {
                label: "Student Hub",
                href: "/admin/students",
                icon: Users,
                subItems: [
                    { label: "Registrations", href: "/admin/students" },
                    { label: "Website Users", href: "/admin/students/website-users" },
                    { label: "Fee Management", href: "/admin/students/fees" },
                    { label: "Enrollments", href: "/admin/students/enrollments" }
                ]
            },
            { label: "Attendance", href: "/admin/attendance", icon: ClipboardList },
            { label: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
        ]
    },
    {
        groupLabel: "Website Builder (CMS)",
        items: [
            {
                label: "Website CMS",
                href: "/admin/content",
                icon: Layout,
                subItems: [
                    { label: "Website Overview", href: "/admin/content" },
                    { label: "Homepage Builder", href: "/admin/content/home-builder" },
                    { label: "All Pages", href: "/admin/content/pages" },
                    { label: "Leadership Profile", href: "/admin/content/director" },
                    { label: "About Us", href: "/admin/content/about" },
                    { label: "SEO Settings", href: "/admin/content/seo" },
                    { label: "Forms & Leads", href: "/admin/content/forms" },
                ]
            },
            { label: "Blog & Articles", href: "/admin/blogs", icon: FileText },
            { label: "Media Gallery", href: "/admin/gallery", icon: ImageIcon },
            { label: "Notices & Updates", href: "/admin/notices", icon: Bell },
            { label: "Video Testimonials", href: "/admin/feedback", icon: MonitorPlay },
            { label: "Events Calendar", href: "/admin/events", icon: Calendar },
        ]
    },
    {
        groupLabel: "System",
        items: [
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ]
    }
];

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export default function Sidebar({ className, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn("w-64 flex flex-col h-full bg-muted", className)} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-black text-white shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">N</div>
                    <div className="leading-tight">
                        <h1 className="text-lg font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">NGI Study Zone</h1>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Admin Ops</p>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} aria-label="Close sidebar" className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border bg-card">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>
            
            <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-6">
                {menuGroups.map((group) => (
                    <div key={group.groupLabel} className="space-y-1">
                        <h4 className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            {group.groupLabel}
                        </h4>
                        {group.items.map((item) => (
                            <div key={item.label}>
                                {item.subItems ? (
                                    <details className="group" open={pathname.startsWith(item.href)}>
                                        <summary className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer list-none",
                                            (pathname.startsWith(item.href) && pathname !== "/admin")
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-slate-600 hover:bg-white/50 hover:text-foreground"
                                        )}>
                                            <item.icon className={cn("w-4 h-4 transition-colors", (pathname.startsWith(item.href) && pathname !== "/admin") ? "text-primary" : "text-slate-400")} />
                                            <span className="flex-1">{item.label}</span>
                                            <ChevronDown className="w-4 h-4 opacity-50 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="ml-4 pl-4 mt-1.5 space-y-1 border-l-2 border-border/50">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={`${item.label}-${subItem.label}-${subItem.href}`}
                                                    href={subItem.href}
                                                    onClick={onClose}
                                                    className={cn(
                                                        "block px-3 py-2 rounded-xl text-[12px] font-medium transition-all",
                                                        pathname === subItem.href
                                                            ? "text-primary bg-primary/10 shadow-sm font-semibold"
                                                            : "text-slate-500 hover:text-foreground hover:bg-white/50"
                                                    )}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all group",
                                            pathname === item.href
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "text-slate-600 hover:bg-white/50 hover:text-foreground"
                                        )}>
                                        <item.icon className={cn("w-4 h-4 transition-colors duration-300", pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-border bg-muted/80 backdrop-blur-md relative overflow-hidden">
                <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all duration-300 relative z-10">
                    <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <p className="text-xs font-medium text-foreground transition-colors">Operational</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
