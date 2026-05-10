"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, ArrowLeft, Timer, FileText } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

export default function BookChaptersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const lang = searchParams.get("lang") || "English";

  const [book, setBook] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch("/api/typing/books")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBook(data.find((b: any) => b._id === id));
      });

    fetch(`/api/typing/practice?type=BOOK&bookId=${id}`)
      .then(res => res.json())
      .then(data => {
        setChapters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => { setChapters([]); setLoading(false); });
  }, [id, lang]);

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen items-center bg-[#f5f4ef]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4ef] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href={`/typing/books?lang=${lang}`} className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Books
        </Link>

        {/* Book Header */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/30">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Typing Book</span>
              <h1 className="text-3xl md:text-4xl font-black mt-1">{book?.name || "Book Practice"}</h1>
              {book?.description && <p className="text-slate-400 font-medium mt-2 text-sm">{book.description}</p>}
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-amber-400">{chapters.length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chapters</div>
            </div>
          </div>
        </div>

        {/* Chapters list */}
        {chapters.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">No Chapters Yet</h3>
            <p className="text-slate-500">Admin hasn't added chapters to this book yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <Link
                href={`/typing/books/${id}/chapter/${chapter._id}?lang=${lang}`}
                key={chapter._id}
                className="flex bg-white border border-slate-100 rounded-2xl px-6 py-5 items-center justify-between hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-black text-sm flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-black text-slate-900 text-base group-hover:text-amber-700 transition-colors">{chapter.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      {chapter.language} · {chapter.wordCount} words · {chapter.difficulty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Timer className="w-3.5 h-3.5" /> 10 min
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
