const fs = require('fs');

const code = `
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Keyboard, Clock, Trash2, FileText, Newspaper, Search, BarChart3, Users, LayoutGrid, List, Table as TableIcon, Edit2, Play, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mapKeyToHindi } from "@/modules/typing/utils/hindiMapping";

export default function AdminTypingDashboard() {
  const [passages, setPassages] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [wordSets, setWordSets] = useState<any[]>([]);
  const [essays, setEssays] = useState<any[]>([]);
  const [currentPassages, setCurrentPassages] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("list");
  
  // Modals
  const [showExamModal, setShowExamModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [showWordSetModal, setShowWordSetModal] = useState(false);
  const [showEssayModal, setShowEssayModal] = useState(false);
  const [showCurrentModal, setShowCurrentModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  
  // Edits
  const [editingPassage, setEditingPassage] = useState<any>(null);
  const [adminLanguage, setAdminLanguage] = useState("English");
  const [adminLayout, setAdminLayout] = useState("Inscript");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/typing/dashboard");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");
      setPassages(data.passages || []);
      setExams(data.exams || []);
      setCategories(data.categories || []);
      setWordSets(data.wordSets || []);
      setEssays(data.essays || []);
      setCurrentPassages(data.current || []);
      setResults(data.results || []);
      setBooks(data.books || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to refresh data");
      setLoading(false);
    }
  };

  const handleDeletePassage = async (id: string) => {
    if (!confirm("Delete passage?")) return;
    await fetch(\`/api/admin/typing/passages/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleUpdatePassage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPassage) return;
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await fetch(\`/api/admin/typing/passages/\${editingPassage._id}\`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      toast.success("Updated!");
      setEditingPassage(null);
      setShowPassageModal(false);
      fetchData();
    } finally { setSubmitting(false); }
  };

  const handleAddPassage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await fetch("/api/admin/typing/passages", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      toast.success("Added!");
      form.reset();
      setShowPassageModal(false);
      fetchData();
    } finally { setSubmitting(false); }
  };

  const handleAddExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data: any = Object.fromEntries(new FormData(form).entries());
    data.autoScroll = (form.elements.namedItem('autoScroll') as HTMLInputElement)?.checked;
    data.showScrollbar = (form.elements.namedItem('showScrollbar') as HTMLInputElement)?.checked;
    try {
      const res = await fetch("/api/admin/typing/exams", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Scheduled!");
        setShowExamModal(false);
        fetchData();
      } else toast.error((await res.json()).error);
    } finally { setSubmitting(false); }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Delete exam?")) return;
    await fetch(\`/api/admin/typing/exams/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/admin/typing/books", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    toast.success("Added!");
    setShowBookModal(false);
    fetchData();
    setSubmitting(false);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Delete book?")) return;
    await fetch(\`/api/admin/typing/books/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/admin/typing/categories", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    setShowCategoryModal(false);
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(\`/api/admin/typing/categories/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleAddWordSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
        name: fd.get('name'), category: fd.get('category'), value: fd.get('value'), language: fd.get('language'),
        words: (fd.get('words') as string).split(',').map(w => w.trim()).filter(w => w.length > 0)
    };
    await fetch("/api/admin/typing/words", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    setShowWordSetModal(false);
    fetchData();
  };

  const handleDeleteWordSet = async (id: string) => {
    await fetch(\`/api/admin/typing/words/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleAddEssay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const content = fd.get('content') as string;
    const data = {
        topic: fd.get('topic'), title: fd.get('title'), content, language: fd.get('language'),
        wordCount: content.split(/\\s+/).length,
    };
    await fetch("/api/admin/typing/essays", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    setShowEssayModal(false);
    fetchData();
  };

  const handleDeleteEssay = async (id: string) => {
    await fetch(\`/api/admin/typing/essays/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const handleAddCurrent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/admin/typing/current", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    setShowCurrentModal(false);
    fetchData();
  };

  const handleDeleteCurrent = async (id: string) => {
    await fetch(\`/api/admin/typing/current/\${id}\`, { method: "DELETE" });
    fetchData();
  };

  const fetchResults = async (examId: string) => {
    const res = await fetch(\`/api/admin/typing/results?examId=\${examId}\`);
    setResults(await res.json());
  };

  const handleManageResults = (exam: any) => {
    setSelectedExam(exam);
    fetchResults(exam._id);
  };

  // Filter components
  const filteredExams = exams.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPassages = passages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f5f7fb]">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Typing Exam Management</h1>
           <p className="text-sm text-slate-500 font-medium">Manage typing tests, passages, and track student performance.</p>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Search resources..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowExamModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-lg flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all">
              <Plus className="w-4 h-4" /> Create Test
            </Button>
         </div>
      </div>

      {/* STATS ROW */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5"/></div>
            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Tests</p><h3 className="text-xl font-black text-slate-900 leading-none mt-1">{exams.length}</h3></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5"/></div>
            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Tests</p><h3 className="text-xl font-black text-slate-900 leading-none mt-1">{exams.filter(e => e.status==='Active').length}</h3></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Users className="w-5 h-5"/></div>
            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Passages</p><h3 className="text-xl font-black text-slate-900 leading-none mt-1">{passages.length}</h3></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5"/></div>
            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Books</p><h3 className="text-xl font-black text-slate-900 leading-none mt-1">{books.length}</h3></div>
         </div>
      </div>

      {/* TABS & CONTENT */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="exams" className="w-full">
          <div className="flex items-center justify-between mb-4">
              <TabsList className="flex w-max h-10 bg-slate-100 rounded-lg p-1 overflow-x-auto scrollbar-hide">
                <TabsTrigger value="exams" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Official Exams</TabsTrigger>
                <TabsTrigger value="passages" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Library</TabsTrigger>
                <TabsTrigger value="books" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Books</TabsTrigger>
                <TabsTrigger value="categories" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Categories</TabsTrigger>
                <TabsTrigger value="words" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Words</TabsTrigger>
                <TabsTrigger value="essays" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Essays</TabsTrigger>
                <TabsTrigger value="current" className="rounded-md font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">Current Affairs</TabsTrigger>
              </TabsList>

              <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-1">
                 <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-md", viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}><LayoutGrid className="w-4 h-4"/></button>
                 <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-md", viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}><List className="w-4 h-4"/></button>
                 <button onClick={() => setViewMode("table")} className={cn("p-1.5 rounded-md", viewMode === "table" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}><TableIcon className="w-4 h-4"/></button>
              </div>
          </div>

          <TabsContent value="exams" className="mt-0">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Exam Title</th>
                          <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Category</th>
                          <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Lang / Dur</th>
                          <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Status</th>
                          <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExams.map(exam => (
                          <tr key={exam._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900">{exam.title}</td>
                            <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600">{exam.category}</span></td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{exam.language} • {exam.duration}m</td>
                            <td className="px-6 py-4">
                               <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold flex w-max items-center gap-1", exam.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                                  {exam.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>}
                                  {exam.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Button onClick={() => handleManageResults(exam)} variant="ghost" size="sm" className="h-8 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100">Results</Button>
                                  <button onClick={() => handleDeleteExam(exam._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                      <div className="p-12 text-center text-slate-400">No exams found matching your search.</div>
                    )}
                </div>
             </div>
          </TabsContent>

          {/* ... Add Passages Tab Content ... */}
          <TabsContent value="passages" className="mt-0">
             <div className="mb-4 flex justify-end">
                <Button onClick={() => { setEditingPassage(null); setShowPassageModal(true); }} className="bg-slate-900 hover:bg-black text-white h-9 px-4 rounded-lg text-sm font-semibold shadow-sm"><Plus className="w-4 h-4 mr-2"/> Add Passage</Button>
             </div>
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Title</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Language</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Difficulty</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Words</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPassages.map(p => (
                      <tr key={p._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                         <td className="px-6 py-3 font-semibold text-slate-900">{p.title}</td>
                         <td className="px-6 py-3 text-slate-600">{p.language}</td>
                         <td className="px-6 py-3 text-slate-600"><span className={cn("text-[11px] font-bold px-2 py-0.5 rounded", p.difficulty==='Easy'?'bg-emerald-50 text-emerald-700':p.difficulty==='Medium'?'bg-amber-50 text-amber-700':'bg-rose-50 text-rose-700')}>{p.difficulty}</span></td>
                         <td className="px-6 py-3 text-slate-600 font-medium">{p.wordCount}</td>
                         <td className="px-6 py-3 text-right">
                           <div className="flex items-center justify-end gap-1">
                             <button onClick={() => { setEditingPassage(p); setShowPassageModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="w-4 h-4"/></button>
                             <button onClick={() => handleDeletePassage(p._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </TabsContent>

          {/* ADD OTHER TABS SIMILARLY */}
          <TabsContent value="books" className="mt-0">
             <div className="mb-4 flex justify-end">
                <Button onClick={() => setShowBookModal(true)} className="bg-slate-900 hover:bg-black text-white h-9 px-4 rounded-lg text-sm font-semibold shadow-sm"><Plus className="w-4 h-4 mr-2"/> Add Book</Button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {books.map(book => {
                   const chapters = passages.filter(p => p.bookId && p.bookId.toString() === book._id.toString());
                   return (
                     <div key={book._id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                           <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5"/></div>
                           <button onClick={() => handleDeleteBook(book._id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{book.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-4">{chapters.length} Chapters Assigned</p>
                     </div>
                   );
                })}
             </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
             <div className="mb-4 flex justify-end">
                <Button onClick={() => setShowCategoryModal(true)} className="bg-slate-900 hover:bg-black text-white h-9 px-4 rounded-lg text-sm font-semibold shadow-sm"><Plus className="w-4 h-4 mr-2"/> Add Category</Button>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                   <div key={cat._id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between group">
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="text-slate-300 group-hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
                   </div>
                ))}
             </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* ALL MODALS (Replace Inline Forms) */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-900">Configure New Exam</h2>
                <button onClick={() => setShowExamModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleAddExam} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Exam Mode</label>
                     <select name="examMode" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                       <option value="General">General Practice</option>
                       <option value="SSC">SSC</option>
                       <option value="CPCT">CPCT</option>
                       <option value="Court">Court</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Title</label>
                     <input name="title" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Category</label>
                     <select name="category" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                       <option value="">Select...</option>
                       {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Passage</label>
                     <select name="passageId" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                       <option value="">Select Passage...</option>
                       {passages.map(p => <option key={p._id} value={p._id}>{p.title} ({p.language})</option>)}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Duration (Min)</label>
                     <input type="number" name="duration" defaultValue={10} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Language</label>
                     <select name="language" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                        <option value="English">English</option><option value="Hindi">Hindi</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Backspace Mode</label>
                     <select name="backspaceMode" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                        <option value="full">Full Access</option><option value="word">Word Only</option><option value="disabled">Disabled</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-600 uppercase">Highlight Mode</label>
                     <select name="highlightMode" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none">
                        <option value="word">Active Word</option><option value="none">None (Blind)</option>
                     </select>
                   </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                   <Button type="button" variant="outline" onClick={() => setShowExamModal(false)}>Cancel</Button>
                   <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Exam</Button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* RESULTS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Results: {selectedExam.title}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">{selectedExam.category} • {selectedExam.language} • {results.length} attempts</p>
                </div>
                <button onClick={() => setSelectedExam(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
                <table className="w-full text-left border-collapse text-sm bg-white border border-slate-200 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Student</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">WPM</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Accuracy</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase">Errors</th>
                      <th className="px-6 py-3 font-bold text-slate-500 text-xs uppercase text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(r => (
                      <tr key={r._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{r.userId?.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500">{r.userId?.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600">{r.wpm}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{r.accuracy}%</td>
                        <td className="px-6 py-4 font-bold text-rose-600">{r.errorCount}</td>
                        <td className="px-6 py-4 text-right text-slate-500 text-xs font-medium">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {results.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No results found for this exam.</td></tr>}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('e:\\Ngit\\src\\components\\admin\\typing\\AdminTypingDashboard.tsx', code);
console.log('Done!');
