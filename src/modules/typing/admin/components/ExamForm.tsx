import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';

/**
 * ExamForm Component
 * Specialized form for configuring Typing Exams
 */
export const ExamForm: React.FC<{ onSuccess: () => void, passages: any[] }> = ({ onSuccess, passages }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    
    // Process checkbox values
    data.autoScroll = (e.currentTarget.elements.namedItem('autoScroll') as HTMLInputElement)?.checked;
    data.showScrollbar = (e.currentTarget.elements.namedItem('showScrollbar') as HTMLInputElement)?.checked;

    try {
      const res = await fetch("/api/admin/typing/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        toast.success("Exam Published Successfully!");
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create exam");
      }
    } catch (error) {
      toast.error("Technical error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Schedule Official Exam</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure test rules and content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Title</label>
          <div className="relative">
            <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input name="title" placeholder="e.g. SSC CHSL 2024 Mock" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Passage</label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <select name="passageId" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none" required>
              <option value="">-- Choose from Library --</option>
              {passages.map(p => (
                <option key={p._id} value={p._id}>{p.title} ({p.language})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Category</label>
          <select name="category" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none" required>
            <option value="SSC">SSC (Staff Selection Commission)</option>
            <option value="UP Police">UP Police</option>
            <option value="KVS">KVS / NVS</option>
            <option value="Court">High Court / District Court</option>
            <option value="General">General Practice</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evaluation Mode</label>
          <select name="examMode" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none" required>
            <option value="General">General (Standard WPM)</option>
            <option value="SSC">SSC Standard (Full/Half Mistakes)</option>
            <option value="CPCT">CPCT Standard</option>
            <option value="Court">Judiciary Standard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Language</label>
          <select name="language" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none" required>
            <option value="English">English</option>
            <option value="Hindi">Hindi (Mangal/Kruti)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="number" name="duration" defaultValue={10} min={1} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Backspace Mode</label>
          <select name="backspaceMode" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
            <option value="full">Full Access</option>
            <option value="word">Word Only</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highlight Mode</label>
          <select name="highlightMode" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
            <option value="word">Word Highlight</option>
            <option value="word_error">Error Color</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" name="autoScroll" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Enable Auto-Scroll</p>
            <p className="text-[10px] font-bold text-slate-400">Keep current line centered during typing</p>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" name="showScrollbar" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Show Scrollbar</p>
            <p className="text-[10px] font-bold text-slate-400">Display manual scrollbar in passage area</p>
          </div>
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl text-lg font-black bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200 transition-all transform hover:scale-[1.01]">
        {loading ? "Scheduling..." : "Launch Official Exam"}
      </Button>
    </form>
  );
};
