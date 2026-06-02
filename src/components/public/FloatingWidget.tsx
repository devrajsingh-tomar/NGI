"use client";

import React from "react";
import { 
    Instagram, 
    Facebook, 
    Youtube, 
    Link as LinkIcon, 
    Send,
    Linkedin,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingWidgetProps {
    settings: any;
}

export default function FloatingWidget({ settings }: FloatingWidgetProps) {
    const widgets = settings?.floatingWidgets || [];
    const enabledWidgets = widgets.filter((w: any) => w.enabled && w.value);

    if (enabledWidgets.length === 0) return null;

    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end pointer-events-none select-none">
            {enabledWidgets.map((widget: any, idx: number) => {
                const { type, value, tooltipText = "Contact us" } = widget;

                // 1. Format URL
                let url = value;
                if (type === "whatsapp") {
                    const cleanNumber = value.replace(/[^0-9]/g, "");
                    url = `https://wa.me/${cleanNumber}`;
                } else if (type === "telegram") {
                    const cleanUsername = value.replace(/@/g, "").trim();
                    url = cleanUsername.startsWith("http") ? cleanUsername : `https://t.me/${cleanUsername}`;
                } else if (type === "email") {
                    url = `mailto:${value}`;
                }

                // 2. Select Styling & Icon
                let icon = <LinkIcon className="w-4.5 h-4.5 sm:w-5 h-5" />;
                let themeColor = "bg-slate-900 text-white shadow-slate-900/25 hover:bg-slate-800";
                let ringColor = "border-slate-400";

                if (type === "whatsapp") {
                    icon = (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.945 11.472.943 6.033.943 1.61 5.313 1.606 10.74c-.001 1.692.443 3.344 1.288 4.793l-.994 3.633 3.753-.972zm11.702-7.112c-.318-.159-1.88-.915-2.17-.1.02-.295-.125-.453-.362-.572-.236-.118-.827-.34-1.341-.78-.4-.343-.726-.763-.956-1.245-.276-.58-.046-.894.095-1.036.126-.127.282-.328.423-.491.14-.164.188-.273.282-.455.093-.182.047-.34-.023-.499-.07-.159-.624-1.482-.856-2.029-.226-.533-.478-.46-.656-.47l-.561-.01c-.193 0-.509.072-.775.361-.266.29-1.018.981-1.018 2.392 0 1.41 1.04 2.775 1.185 2.97.145.195 2.05 3.09 4.962 4.331.693.295 1.233.472 1.654.605.698.22 1.33.19 1.831.116.559-.083 1.716-.692 1.958-1.36.242-.669.242-1.242.17-1.36-.073-.119-.267-.196-.587-.356z"/>
                        </svg>
                    );
                    themeColor = "bg-[#25D366] text-white shadow-[#25D366]/30 hover:bg-[#20ba59]";
                    ringColor = "border-[#25D366]";
                } else if (type === "telegram") {
                    icon = <Send className="w-4 h-4 sm:w-5 h-5 rotate-[320deg] -translate-x-0.5 translate-y-0.5" />;
                    themeColor = "bg-[#0088cc] text-white shadow-[#0088cc]/25 hover:bg-[#0077b3]";
                    ringColor = "border-[#0088cc]";
                } else if (type === "instagram") {
                    icon = <Instagram className="w-4.5 h-4.5 sm:w-5 h-5" />;
                    themeColor = "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-purple-500/20 hover:opacity-95";
                    ringColor = "border-pink-500";
                } else if (type === "facebook") {
                    icon = <Facebook className="w-4.5 h-4.5 sm:w-5 h-5" />;
                    themeColor = "bg-[#1877F2] text-white shadow-[#1877F2]/25 hover:bg-[#166fe5]";
                    ringColor = "border-[#1877F2]";
                } else if (type === "youtube") {
                    icon = <Youtube className="w-4.5 h-4.5 sm:w-5 h-5" />;
                    themeColor = "bg-[#FF0000] text-white shadow-[#FF0000]/25 hover:bg-[#e60000]";
                    ringColor = "border-[#FF0000]";
                } else if (type === "linkedin") {
                    icon = <Linkedin className="w-4.5 h-4.5 sm:w-5 h-5" />;
                    themeColor = "bg-[#0077b5] text-white shadow-[#0077b5]/25 hover:bg-[#006294]";
                    ringColor = "border-[#0077b5]";
                } else if (type === "email") {
                    icon = <Mail className="w-4.5 h-4.5 sm:w-5 h-5" />;
                    themeColor = "bg-[#EA4335] text-white shadow-[#EA4335]/25 hover:bg-[#d62f22]";
                    ringColor = "border-[#EA4335]";
                }

                return (
                    <div key={idx} className="group relative flex items-center gap-3 pointer-events-auto select-none">
                        {/* Tooltip text (slides in from right/fades in) */}
                        <div 
                            className={cn(
                                "px-3 py-1.5 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] font-black rounded-lg border border-white/10 shadow-lg",
                                "transition-all duration-300 transform translate-x-2 opacity-0 origin-right whitespace-nowrap",
                                "group-hover:translate-x-0 group-hover:opacity-100 hidden md:block pointer-events-none"
                            )}
                        >
                            {tooltipText}
                        </div>

                        {/* Floating Action Button */}
                        <div className="relative">
                            {/* Pulse ring indicator */}
                            <div className={cn(
                                "absolute -inset-0.5 rounded-full border border-dashed animate-pulse opacity-30",
                                ringColor
                            )} />
                            <a 
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={tooltipText}
                                className={cn(
                                    "w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hover:rotate-6",
                                    themeColor
                                )}
                            >
                                {icon}
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
