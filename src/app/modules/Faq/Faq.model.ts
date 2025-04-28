import { model, Schema } from "mongoose";
import { IFaq } from "./Faq.interface";

const faqSchema = new Schema<IFaq>({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: "General",
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true, versionKey: false });

const FaqModel = model<IFaq>('Faq', faqSchema);
export default FaqModel;
