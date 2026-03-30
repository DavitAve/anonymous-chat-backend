import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    // Сохраняем черты характера, чтобы юзеру не приходилось вводить их заново
    traits: {
      energy: { type: Number, default: 5 },
      talkativeness: { type: Number, default: 5 },
      logic: { type: Number, default: 5 },
      interests: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
