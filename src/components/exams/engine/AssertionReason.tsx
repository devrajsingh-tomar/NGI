import React from "react";
import { Question } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  language: "en" | "hi";
}

export default function AssertionReason({ question, value, onChange, language }: Props) {
  const options = [
    { id: "A", text: "Both Assertion & Reason are true, Reason is correct explanation" },
    { id: "B", text: "Both are true, but Reason is NOT correct explanation" },
    { id: "C", text: "Assertion is true, but Reason is false" },
    { id: "D", text: "Assertion is false, but Reason is true" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
            Statement I: Assertion
          </p>
          <p className="text-xl font-bold text-slate-800 italic leading-relaxed">
            {question.assertion?.[language] || question.assertion?.en}
          </p>
        </div>
        <div className="bg-purple-50/50 p-8 rounded-[2rem] border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">
            Statement II: Reason
          </p>
          <p className="text-xl font-bold text-slate-800 italic leading-relaxed">
            {question.reason?.[language] || question.reason?.en}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
          Select the Correct Interpretation
        </p>
        <div className="grid gap-3">
          {options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => onChange(i.toString())}
              className={cn(
                "w-full p-6 rounded-2xl text-left font-bold text-base transition-all border-2",
                value === i.toString()
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.01]"
                  : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <span className={cn(
                "mr-4 font-black",
                value === i.toString() ? "text-primary-foreground/50" : "text-slate-300"
              )}>
                {opt.id}.
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
