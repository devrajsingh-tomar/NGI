"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Search, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("lang")) setSelectedLanguage(params.get("lang") || "English");
    
    fetch("/api/typing/books")
      .then(res => res.json())
      .then(data => {
        setBooks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen items-center bg-[#f5f4ef]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4ef] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/typing" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Practice
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Typing Books</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Master specialized chapters in {selectedLanguage}</p>
          <hr className="border-t border-slate-900 mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-500">No books available at the moment.</div>
          ) : (
            books.map((book) => (
              <Link href={`/typing/books/${book._id}?lang=${selectedLanguage}`} key={book._id}>
                <Card className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                   
                   <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-200">
                      <BookOpen className="w-8 h-8" />
                   </div>

                   <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-amber-600 transition-colors">
                     {book.name}
                   </h3>
                   
                   <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                     {book.description || "Comprehensive typing practice book for specialized examination patterns."}
                   </p>

                   <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select to View Chapters</span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                   </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
