import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    skill: {
      type: String,
      enum: ["batting", "bowling", "all-rounder"],
      required: true
    },
    basePrice: { type: Number, required: true, min: 0 },
    stats: {
      matchesPlayed: { type: Number, default: 0, min: 0 },
      runsScored: { type: Number, default: 0, min: 0 },
      wicketsTaken: { type: Number, default: 0, min: 0 },
      strikeRate: { type: Number, default: 0, min: 0 }
    },
    status: {
      type: String,
      enum: ["available", "sold", "unsold"],
      default: "available"
    },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    soldPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
