import React from "react";
import { Question } from "./types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  language: "en" | "hi";
}

export default function MCQMulti({ question, value = [], onChange, language }: Props) {
  const handleToggle = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {question.options?.map((option, idx) => {
        const isSelected = value.includes(option._id);
        const optText = option.text[language] || option.text.en;

        return (
          <button
            key={option._id}
            onClick={() => handleToggle(option._id)}
            className={cn(
              "w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-slate-100 bg-white hover:border-slate-200"
            )}
          >
            <div
              className={cn(
                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                isSelected ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-400"
              )}
            >
              <Checkbox checked={isSelected} className="border-none shadow-none text-current" />
            </div>
            <span
              className={cn(
                "text-lg transition-colors",
                isSelected ? "font-bold text-slate-900" : "text-slate-600"
              )}
            >
              {optText}
            </span>
          </button>
        );
      })}
    </div>
  );
}
