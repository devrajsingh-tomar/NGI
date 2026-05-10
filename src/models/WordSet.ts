import mongoose, { Schema, model, models } from "mongoose";

export interface IWordSet {
  name: string;
  category: "A-Z" | "Length";
  value: string; // e.g., 'A', 'B' or '5', '6'
  words: string[];
  language: "English" | "Hindi";
}

const WordSetSchema = new Schema<IWordSet>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    words: [{ type: String }],
    language: { type: String, enum: ["English", "Hindi"], default: "English" },
  },
  { timestamps: true }
);

const WordSet = models.WordSet || model("WordSet", WordSetSchema);
export default WordSet;
