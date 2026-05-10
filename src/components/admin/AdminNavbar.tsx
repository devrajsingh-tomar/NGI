"use client";

import NotificationBell from "../shared/NotificationBell";
import { Search, Menu, LogOut, User, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface AdminNavbarProps {
    onMenuClick?: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const { data: session } = useSession();

    return (
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
            <div className="flex items-center gap-6 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2.5 text-slate-500 hover:text-foreground hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-border hover:shadow-sm"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:block">
                    <NotificationBell />
                </div>
                <div className="w-px h-8 bg-border" />
                
                <div className="relative">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-4 hover:bg-muted pl-1.5 pr-3 py-1.5 rounded-full transition-all group border border-transparent hover:border-border">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-foreground tracking-tight">{session?.user?.name || "NGI Study Zone Admin"}</p>
                                    <p className="text-[11px] text-primary font-medium mt-0.5">Administrator</p>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                                        {session?.user?.name?.[0] || "A"}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-xl shadow-slate-200/50 border-border bg-white text-slate-700" align="end" sideOffset={8}>
                            <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground px-3 mb-1">Account</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl p-3 font-medium focus:text-primary focus:bg-primary/5 cursor-pointer gap-3" asChild>
                                <Link href="/admin/settings">
                                    <User className="w-4 h-4" /> Profile Info
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl p-3 font-medium focus:text-primary focus:bg-primary/5 cursor-pointer gap-3" asChild>
                                <Link href="/admin/settings">
                                    <Settings className="w-4 h-4" /> System Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-border" />
                            <DropdownMenuItem 
                                className="rounded-xl p-3 font-medium text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer gap-3"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <LogOut className="w-4 h-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
