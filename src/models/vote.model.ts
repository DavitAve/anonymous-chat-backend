import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    feature: { type: String, required: true }, // Например: "smart_search"
    vote: { type: String, enum: ["yes", "no"], required: true },
  },
  { timestamps: true }
);

export const Vote = mongoose.model("Vote", voteSchema);