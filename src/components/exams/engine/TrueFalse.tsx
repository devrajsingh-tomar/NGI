import React from "react";
import { Question } from "./types";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Props {
  question: Question;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function TrueFalse({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <button
        onClick={() => onChange(true)}
        className={cn(
          "flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-2 transition-all gap-4",
          value === true
            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
            : "border-slate-100 bg-white hover:border-emerald-200"
        )}
      >
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all",
          value === true ? "bg-emerald-500 text-white shadow-xl" : "bg-emerald-100 text-emerald-500"
        )}>
          <Check className="w-8 h-8" />
        </div>
        <span className="text-xl font-black uppercase tracking-widest">True</span>
      </button>

      <button
        onClick={() => onChange(false)}
        className={cn(
          "flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-2 transition-all gap-4",
          value === false
            ? "border-red-500 bg-red-50 text-red-700 shadow-lg"
            : "border-slate-100 bg-white hover:border-red-200"
        )}
      >
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all",
          value === false ? "bg-red-500 text-white shadow-xl" : "bg-red-100 text-red-500"
        )}>
          <X className="w-8 h-8" />
        </div>
        <span className="text-xl font-black uppercase tracking-widest">False</span>
      </button>
    </div>
  );
}
