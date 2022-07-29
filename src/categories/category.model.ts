import { Schema, Document } from "mongoose";

export const CategorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Category extends Document {
  name: string;
  description: string;
}
