import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingDifficulty {
  name: "Easy" | "Medium" | "Hard";
  expectedWpm: string;
  wordCountRange: string;
  complexity: string;
  description: string;
  color: string;
}

const TypingDifficultySchema = new Schema<ITypingDifficulty>(
  {
    name: { type: String, enum: ["Easy", "Medium", "Hard"], required: true, unique: true },
    expectedWpm: { type: String, default: "25-35" },
    wordCountRange: { type: String, default: "250-350" },
    complexity: { type: String, default: "Beginner" },
    description: { type: String, default: "" },
    color: { type: String, default: "emerald" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.TypingDifficulty) {
  delete (models as any).TypingDifficulty;
}
const TypingDifficulty = models.TypingDifficulty || model("TypingDifficulty", TypingDifficultySchema);
export default TypingDifficulty;
