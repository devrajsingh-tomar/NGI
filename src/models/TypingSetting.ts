import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingSetting {
  key: string;
  value: any;
  description: string;
}

const TypingSettingSchema = new Schema<ITypingSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && models.TypingSetting) {
  delete (models as any).TypingSetting;
}
const TypingSetting = models.TypingSetting || model("TypingSetting", TypingSettingSchema);
export default TypingSetting;
