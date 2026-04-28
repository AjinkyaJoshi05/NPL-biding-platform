import mongoose from "mongoose";

const rosterPlayerSchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    managerName: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    roster: [rosterPlayerSchema]
  },
  { timestamps: true }
);

teamSchema.virtual("remainingBudget").get(function getRemainingBudget() {
  return this.budget - this.spent;
});

teamSchema.set("toJSON", { virtuals: true });
teamSchema.set("toObject", { virtuals: true });

export const Team = mongoose.model("Team", teamSchema);
