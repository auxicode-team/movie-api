import { Schema, Document } from "mongoose";

export const MovieSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
);

export interface Movie extends Document {
  title: string;
  description: string;
  category: string;
  images: any[];
}
