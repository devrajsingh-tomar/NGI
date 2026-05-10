import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  bgColor: string;       // Tailwind gradient or hex — used as fallback
  imageUrl?: string;     // Optional uploaded background image
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, default: "", trim: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    cta1Text: { type: String, default: "Learn More" },
    cta1Link: { type: String, default: "/" },
    cta2Text: { type: String, default: "Contact Us" },
    cta2Link: { type: String, default: "/contact" },
    bgColor: { type: String, default: "from-primary via-primary to-indigo-900" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HeroSlide = models.HeroSlide || model<IHeroSlide>("HeroSlide", HeroSlideSchema);
export default HeroSlide;
