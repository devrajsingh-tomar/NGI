import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptiveAnswer({ value, onChange }: Props) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 space-y-4">
      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">
        Descriptive Response
      </Label>
      <Textarea
        className="min-h-[250px] p-6 rounded-2xl bg-slate-50 border-none text-lg font-medium text-slate-800 focus-visible:ring-primary/20 resize-none"
        placeholder="Type your detailed answer here..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex justify-end">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          {value?.length || 0} Characters
        </span>
      </div>
    </div>
  );
}
