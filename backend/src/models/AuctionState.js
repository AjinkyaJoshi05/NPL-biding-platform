import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    amount: { type: Number, required: true, min: 0 },
    placedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const auctionStateSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    currentPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null
    },
    currentBid: { type: Number, default: 0, min: 0 },
    leadingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    bidHistory: [bidSchema],
    playerStartedAt: { type: Date, default: null },
    roundEndsAt: { type: Date, default: null },
    timerSeconds: { type: Number, default: 20 },
    auctionStatus: {
      type: String,
      enum: ["NOT_STARTED", "ONGOING", "ENDED"],
      default: "NOT_STARTED"
    }
  },
  { timestamps: true }
);

export const AuctionState = mongoose.model("AuctionState", auctionStateSchema);
