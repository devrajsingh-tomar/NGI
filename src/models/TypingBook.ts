import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingBook {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TypingBookSchema = new Schema<ITypingBook>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const TypingBook = models.TypingBook || model("TypingBook", TypingBookSchema);
export default TypingBook;
