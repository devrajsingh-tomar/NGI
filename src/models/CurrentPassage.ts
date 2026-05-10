import mongoose, { Schema, model, models } from "mongoose";

export interface ICurrentPassage {
  title: string;
  content: string;
  date: Date;
  language: "English" | "Hindi";
}

const CurrentPassageSchema = new Schema<ICurrentPassage>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    language: { type: String, enum: ["English", "Hindi"], default: "English" },
  },
  { timestamps: true }
);

const CurrentPassage = models.CurrentPassage || model("CurrentPassage", CurrentPassageSchema);
export default CurrentPassage;
