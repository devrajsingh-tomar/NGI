"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, CheckCircle2, AlertCircle, AlertTriangle, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const pages = [
  { slug: "/", title: "Home", metaTitle: "NGI Study Zone – National Genius Institute", metaDesc: "Learn typing, crack government exams. Join NGI Study Zone today.", score: 92 },
  { slug: "/about", title: "About Us", metaTitle: "About NGI Study Zone – Our Mission & Vision", metaDesc: "Discover our story, faculty, and achievements.", score: 78 },
  { slug: "/courses", title: "Courses", metaTitle: "", metaDesc: "Explore all government exam preparation courses.", score: 45 },
  { slug: "/contact", title: "Contact", metaTitle: "Contact NGI Study Zone – Get In Touch", metaDesc: "", score: 60 },
  { slug: "/privacy", title: "Privacy Policy", metaTitle: "Privacy Policy – NGI Study Zone", metaDesc: "Read our privacy policy.", score: 88 },
];

function SEOScore({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-600 bg-emerald-50" : score >= 60 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";
  const label = score >= 80 ? "Good" : score >= 60 ? "Needs Work" : "Poor";
  return (
    <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-black uppercase", color)}>
      {score} · {label}
    </span>
  );
}

export default function SEOSettingsPage() {
  const [selected, setSelected] = useState(pages[0]);
  const [form, setForm] = useState({ metaTitle: selected.metaTitle, metaDesc: selected.metaDesc });

  const handleSelect = (page: typeof pages[0]) => {
    setSelected(page);
    setForm({ metaTitle: page.metaTitle, metaDesc: page.metaDesc });
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f7fb]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shrink-0">
        <Link href="/admin/content" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-black text-slate-900">SEO Settings</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Edit meta titles, descriptions & rankings per page</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Page list */}
        <div className="w-64 bg-white border-r border-slate-100 p-4 overflow-y-auto shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pages</p>
          <div className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.slug}
                onClick={() => handleSelect(page)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg transition-all",
                  selected.slug === page.slug ? "bg-orange-50 border border-orange-200" : "hover:bg-slate-50"
                )}
              >
                <p className="text-xs font-bold text-slate-900">{page.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-mono text-slate-400">{page.slug}</p>
                  <SEOScore score={page.score} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 mb-4">Editing: {selected.title}</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest block mb-2">
                    Meta Title
                    <span className="ml-2 text-slate-300 font-normal normal-case tracking-normal">{form.metaTitle.length}/60 chars</span>
                  </label>
                  <input
                    value={form.metaTitle}
                    onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                    placeholder="e.g. NGI Study Zone – Best Typing Institute in MP"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-violet-100 font-medium"
                  />
                  {form.metaTitle.length > 60 && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Too long — search engines may cut this off</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest block mb-2">
                    Meta Description
                    <span className="ml-2 text-slate-300 font-normal normal-case tracking-normal">{form.metaDesc.length}/160 chars</span>
                  </label>
                  <textarea
                    value={form.metaDesc}
                    onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
                    placeholder="Describe this page in 1–2 sentences for search engines..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-violet-100 font-medium resize-none"
                  />
                  {form.metaDesc.length > 160 && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Too long — keep under 160 characters</p>
                  )}
                </div>
              </div>

              {/* Google Preview */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Google Search Preview</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-mono">ngit.ac.in{selected.slug}</p>
                  <p className="text-orange-600 text-sm font-semibold hover:underline cursor-pointer">
                    {form.metaTitle || `${selected.title} | NGI Study Zone`}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {form.metaDesc || "No description provided. Add a meta description to improve click-through rates."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => toast.success("SEO settings saved!")}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> Save SEO Settings
                </button>
              </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-3">SEO Tips</h3>
              <div className="space-y-2">
                {[
                  { ok: form.metaTitle.length > 20 && form.metaTitle.length <= 60, msg: "Meta title is between 20–60 characters" },
                  { ok: form.metaDesc.length > 50 && form.metaDesc.length <= 160, msg: "Meta description is between 50–160 characters" },
                  { ok: form.metaTitle.toLowerCase().includes("ngit") || form.metaTitle.toLowerCase().includes("typing"), msg: "Title contains your brand keyword" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                    {tip.ok
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    }
                    <span className={tip.ok ? "text-slate-600" : "text-amber-600"}>{tip.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
