import { AuctionState } from "../models/AuctionState.js";
import { Player } from "../models/Player.js";
import { Team } from "../models/Team.js";

const DEFAULT_TIMER_SECONDS = Number(process.env.AUCTION_TIMER_SECONDS || 20);

async function pickNextPlayer() {
  return Player.findOne({ status: "available" }).sort({ createdAt: 1 });
}

function getRoundEndsAt() {
  return new Date(Date.now() + DEFAULT_TIMER_SECONDS * 1000);
}

async function getNextPlayers(limit = 5) {
  return Player.find({ status: "available" }).sort({ createdAt: 1 }).limit(limit);
}

async function loadNextPlayer(state, { startTimer = false } = {}) {
  const nextPlayer = await pickNextPlayer();

  state.currentPlayer = nextPlayer?._id || null;
  state.currentBid = nextPlayer ? nextPlayer.basePrice : 0;
  state.leadingTeam = null;
  state.bidHistory = [];
  state.playerStartedAt = startTimer && nextPlayer ? new Date() : null;
  state.roundEndsAt = startTimer && nextPlayer ? getRoundEndsAt() : null;
  state.timerSeconds = DEFAULT_TIMER_SECONDS;
  state.auctionStatus = nextPlayer ? (startTimer ? "ONGOING" : "NOT_STARTED") : "ENDED";

  await state.save();
  return state;
}

export async function getOrCreateAuctionState() {
  let state = await AuctionState.findOne({ key: "main" });

  if (!state) {
    const currentPlayer = await pickNextPlayer();
    state = await AuctionState.create({
      key: "main",
      currentPlayer: currentPlayer?._id || null,
      currentBid: currentPlayer?.basePrice || 0,
      leadingTeam: null,
      bidHistory: [],
      playerStartedAt: null,
      roundEndsAt: null,
      timerSeconds: DEFAULT_TIMER_SECONDS,
      auctionStatus: currentPlayer ? "NOT_STARTED" : "ENDED"
    });
  }

  if (!state.currentPlayer) {
    await loadNextPlayer(state);
  }

  await finalizeExpiredRound(state);
  return populateAuctionState(state);
}

export async function populateAuctionState(state) {
  return state.populate([
    { path: "currentPlayer" },
    { path: "leadingTeam" },
    { path: "bidHistory.team" }
  ]);
}

export function getSecondsRemaining(state) {
  if (state.auctionStatus !== "ONGOING" || !state.currentPlayer || !state.roundEndsAt) {
    return 0;
  }

  return Math.max(Math.ceil((state.roundEndsAt.getTime() - Date.now()) / 1000), 0);
}

export async function finalizeExpiredRound(state) {
  if (!state.currentPlayer || state.auctionStatus !== "ONGOING" || getSecondsRemaining(state) > 0) {
    return state;
  }

  if (state.leadingTeam) {
    const team = await Team.findById(state.leadingTeam);
    if (team && team.budget - team.spent >= state.currentBid) {
      await Player.findByIdAndUpdate(state.currentPlayer, {
        status: "sold",
        soldTo: team._id,
        soldPrice: state.currentBid
      });

      team.spent += state.currentBid;
      team.roster.push({ player: state.currentPlayer, price: state.currentBid });
      await team.save();
    } else {
      await Player.findByIdAndUpdate(state.currentPlayer, { status: "unsold" });
    }
  } else {
    await Player.findByIdAndUpdate(state.currentPlayer, { status: "unsold" });
  }

  return loadNextPlayer(state, { startTimer: true });
}

export async function startAuction() {
  const state = await getOrCreateAuctionState();

  if (!state.currentPlayer) {
    const error = new Error("No players are available to start the auction.");
    error.status = 400;
    throw error;
  }

  if (state.auctionStatus === "ENDED") {
    const error = new Error("Auction has already ended.");
    error.status = 400;
    throw error;
  }

  state.auctionStatus = "ONGOING";
  state.playerStartedAt = new Date();
  state.roundEndsAt = getRoundEndsAt();
  await state.save();

  return populateAuctionState(state);
}

export async function placeBid({ teamId, amount }) {
  const numericAmount = Number(amount);
  if (!teamId || !Number.isFinite(numericAmount)) {
    const error = new Error("teamId and numeric amount are required.");
    error.status = 400;
    throw error;
  }

  const state = await getOrCreateAuctionState();
  if (!state.currentPlayer) {
    const error = new Error("No player is currently available for auction.");
    error.status = 400;
    throw error;
  }

  if (state.auctionStatus !== "ONGOING" || getSecondsRemaining(state) <= 0) {
    const error = new Error("Auction is not currently active.");
    error.status = 400;
    throw error;
  }

  const team = await Team.findById(teamId);
  if (!team) {
    const error = new Error("Team not found.");
    error.status = 404;
    throw error;
  }

  if (numericAmount <= state.currentBid) {
    const error = new Error(`Bid must be greater than ${state.currentBid}.`);
    error.status = 400;
    throw error;
  }

  if (team.budget - team.spent < numericAmount) {
    const error = new Error("Team does not have enough remaining budget.");
    error.status = 400;
    throw error;
  }

  state.currentBid = numericAmount;
  state.leadingTeam = team._id;
  state.roundEndsAt = getRoundEndsAt();
  state.auctionStatus = "ONGOING";
  state.bidHistory.push({ team: team._id, amount: numericAmount, placedAt: new Date() });
  await state.save();

  return populateAuctionState(state);
}

export async function getUpcomingPlayers(currentPlayerId, limit = 5) {
  const players = await getNextPlayers(limit + 1);
  return players
    .filter((player) => player._id.toString() !== currentPlayerId?.toString())
    .slice(0, limit);
}
