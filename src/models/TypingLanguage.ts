import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingLanguage {
  name: string;
  code: string;
  icon: string;
  description: string;
  active: boolean;
}

const TypingLanguageSchema = new Schema<ITypingLanguage>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    icon: { type: String, default: "⌨️" },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.TypingLanguage) {
  delete (models as any).TypingLanguage;
}
const TypingLanguage = models.TypingLanguage || model("TypingLanguage", TypingLanguageSchema);
export default TypingLanguage;
