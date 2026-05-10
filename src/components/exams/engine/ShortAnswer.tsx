import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ShortAnswer({ value, onChange }: Props) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 space-y-4">
      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">
        Type Your Answer (Short)
      </Label>
      <Input
        className="h-16 px-6 rounded-2xl bg-slate-50 border-none text-xl font-bold text-slate-800 focus-visible:ring-primary/20"
        placeholder="Enter your answer here..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
