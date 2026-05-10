import React from "react";
import { Question } from "./types";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  question: Question;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  language: "en" | "hi";
}

export default function MatchFollowing({ question, value = {}, onChange, language }: Props) {
  const options = question.options || [];

  const handleMatch = (optionId: string, matchId: string) => {
    onChange({ ...value, [optionId]: matchId });
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="grid grid-cols-2 gap-10 font-black text-[10px] text-slate-400 uppercase tracking-widest mb-2 px-4">
        <span>Column A</span>
        <span>Column B (Select Match)</span>
      </div>
      <div className="space-y-4">
        {options.map((opt, idx) => (
          <div key={opt._id} className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
              {String.fromCharCode(65 + idx)}
            </div>
            <div className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold text-slate-700">
              {opt.text[language] || opt.text.en}
            </div>
            <ArrowRight className="w-6 h-6 text-slate-300" />
            <div className="flex-1">
              <Select
                value={value[opt._id] || ""}
                onValueChange={(val) => handleMatch(opt._id, val)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-white font-bold text-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select Match" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  {options.map((pairOpt, pIdx) => (
                    <SelectItem
                      key={pairOpt._id}
                      value={pairOpt._id}
                      className="font-bold py-3 rounded-xl"
                    >
                      {pIdx + 1}. {pairOpt.pair?.[language] || pairOpt.pair?.en || pairOpt.text[language] || pairOpt.text.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
