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
                const lowerVal = value.trim().toLowerCase();
                const isUrl = lowerVal.startsWith("http://") || lowerVal.startsWith("https://") || lowerVal.startsWith("mailto:") || lowerVal.startsWith("tel:");

                if (!isUrl) {
                    if (type === "whatsapp") {
                        const cleanNumber = value.replace(/[^0-9]/g, "");
                        url = `https://wa.me/${cleanNumber}`;
                    } else if (type === "telegram") {
                        const cleanUsername = value.replace(/@/g, "").trim();
                        url = `https://t.me/${cleanUsername}`;
                    } else if (type === "email") {
                        url = `mailto:${value}`;
                    }
                }

                // 2. Select Styling & Icon
                let icon = <LinkIcon className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
                let themeColor = "bg-slate-900 text-white shadow-slate-900/25 hover:bg-slate-800";
                let ringColor = "border-slate-400";

                if (type === "whatsapp") {
                    icon = (
                        <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-6 sm:h-6 fill-current pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                        </svg>
                    );
                    themeColor = "bg-[#25D366] text-white shadow-[#25D366]/30 hover:bg-[#20ba59]";
                    ringColor = "border-[#25D366]";
                } else if (type === "telegram") {
                    icon = <Send className="w-4 h-4 sm:w-5 h-5 rotate-[320deg] -translate-x-0.5 translate-y-0.5 pointer-events-none" />;
                    themeColor = "bg-[#0088cc] text-white shadow-[#0088cc]/25 hover:bg-[#0077b3]";
                    ringColor = "border-[#0088cc]";
                } else if (type === "instagram") {
                    icon = <Instagram className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
                    themeColor = "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-purple-500/20 hover:opacity-95";
                    ringColor = "border-pink-500";
                } else if (type === "facebook") {
                    icon = <Facebook className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
                    themeColor = "bg-[#1877F2] text-white shadow-[#1877F2]/25 hover:bg-[#166fe5]";
                    ringColor = "border-[#1877F2]";
                } else if (type === "youtube") {
                    icon = <Youtube className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
                    themeColor = "bg-[#FF0000] text-white shadow-[#FF0000]/25 hover:bg-[#e60000]";
                    ringColor = "border-[#FF0000]";
                } else if (type === "linkedin") {
                    icon = <Linkedin className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
                    themeColor = "bg-[#0077b5] text-white shadow-[#0077b5]/25 hover:bg-[#006294]";
                    ringColor = "border-[#0077b5]";
                } else if (type === "email") {
                    icon = <Mail className="w-4.5 h-4.5 sm:w-5 h-5 pointer-events-none" />;
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
                        <div className="relative pointer-events-auto">
                            {/* Pulse ring indicator */}
                            <div className={cn(
                                "absolute -inset-0.5 rounded-full border border-dashed animate-pulse opacity-30 pointer-events-none",
                                ringColor
                            )} />
                            <a 
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={tooltipText}
                                className={cn(
                                    "w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hover:rotate-6",
                                    "pointer-events-auto cursor-pointer relative z-10",
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
