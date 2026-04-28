import "dotenv/config";
import { connectDB } from "../config/db.js";
import { AuctionState } from "../models/AuctionState.js";
import { Player } from "../models/Player.js";
import { Team } from "../models/Team.js";
import { players } from "../data/players.js";
import { teams } from "../data/teams.js";

async function seed() {
  await connectDB();

  await Promise.all([
    AuctionState.deleteMany({}),
    Player.deleteMany({}),
    Team.deleteMany({})
  ]);

  const createdPlayers = await Player.insertMany(players);
  await Team.insertMany(teams);

  await AuctionState.create({
    key: "main",
    currentPlayer: createdPlayers[0]._id,
    currentBid: createdPlayers[0].basePrice,
    leadingTeam: null,
    bidHistory: [],
    playerStartedAt: null,
    roundEndsAt: null,
    timerSeconds: Number(process.env.AUCTION_TIMER_SECONDS || 20),
    auctionStatus: "NOT_STARTED"
  });

  console.log(`Seeded ${createdPlayers.length} players and ${teams.length} teams.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
