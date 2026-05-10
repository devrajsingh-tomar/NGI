import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function NumericInput({ value, onChange }: Props) {
  return (
    <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
        Enter Your Numeric Answer
      </Label>
      <Input
        className="max-w-[300px] h-24 rounded-3xl bg-slate-50 border-none text-center text-5xl font-black text-primary focus-visible:ring-primary/20"
        type="number"
        placeholder="0.00"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-slate-400 font-medium text-sm mt-8 flex items-center gap-2">
        <Info className="w-4 h-4" /> Use numbers only. Decimals are accepted.
      </p>
    </div>
  );
}
