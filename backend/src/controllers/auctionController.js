import {
  getUpcomingPlayers,
  getOrCreateAuctionState,
  getSecondsRemaining,
  placeBid,
  startAuction
} from "../services/auctionService.js";
import { Player } from "../models/Player.js";
import { Team } from "../models/Team.js";

function formatAuctionState(state) {
  return {
    currentPlayer: state.currentPlayer,
    currentBid: state.currentBid,
    leadingTeam: state.leadingTeam,
    bidHistory: state.bidHistory,
    timerSeconds: state.timerSeconds,
    timeLeft: getSecondsRemaining(state),
    auctionStatus: state.auctionStatus,
    status: state.auctionStatus
  };
}

async function buildAuctionPayload(state) {
  const teams = await Team.find().populate("roster.player").sort({ createdAt: 1 });
  const nextPlayers = await getUpcomingPlayers(state.currentPlayer?._id, 5);

  return {
    auction: formatAuctionState(state),
    currentPlayer: state.currentPlayer,
    nextPlayers,
    teams
  };
}

export async function getPlayers(req, res) {
  const players = await Player.find().populate("soldTo").sort({ createdAt: 1 });
  const auction = await getOrCreateAuctionState();

  res.json({
    players,
    availablePlayers: players.filter((player) => player.status === "available"),
    auction: formatAuctionState(auction)
  });
}

export async function getTeams(req, res) {
  const teams = await Team.find().populate("roster.player").sort({ createdAt: 1 });
  res.json({ teams });
}

export async function getAuction(req, res) {
  const auction = await getOrCreateAuctionState();
  res.json(await buildAuctionPayload(auction));
}

export async function getAuctionState(req, res) {
  const auction = await getOrCreateAuctionState();
  res.json(await buildAuctionPayload(auction));
}

export async function postBid(req, res) {
  const auction = await placeBid(req.body);
  res.status(201).json({ message: "Bid placed.", ...(await buildAuctionPayload(auction)) });
}

export async function postStartAuction(req, res) {
  const auction = await startAuction();
  res.json({ message: "Auction started.", ...(await buildAuctionPayload(auction)) });
}
