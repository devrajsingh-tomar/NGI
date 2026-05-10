import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingTopic {
  name: string;
  slug: string;
  category: "Essay" | "Current Affairs" | "Legal" | "Historical" | "Government Scheme" | "Court" | "General";
  description: string;
  active: boolean;
}

const TypingTopicSchema = new Schema<ITypingTopic>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["Essay", "Current Affairs", "Legal", "Historical", "Government Scheme", "Court", "General"], default: "General" },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.TypingTopic) {
  delete (models as any).TypingTopic;
}
const TypingTopic = models.TypingTopic || model("TypingTopic", TypingTopicSchema);
export default TypingTopic;
