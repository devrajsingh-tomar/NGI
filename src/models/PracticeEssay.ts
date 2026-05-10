import mongoose, { Schema, model, models } from "mongoose";

export interface IPracticeEssay {
  topic: string; // Gandhi, Nehru, etc.
  title: string;
  content: string;
  language: "English" | "Hindi";
  wordCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const PracticeEssaySchema = new Schema<IPracticeEssay>(
  {
    topic: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, enum: ["English", "Hindi"], default: "English" },
    wordCount: { type: Number, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  },
  { timestamps: true }
);

const PracticeEssay = models.PracticeEssay || model("PracticeEssay", PracticeEssaySchema);
export default PracticeEssay;
