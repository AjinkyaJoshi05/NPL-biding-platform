import express from "express";
import {
  getAuction,
  getAuctionState,
  getPlayers,
  getTeams,
  postBid,
  postStartAuction
} from "../controllers/auctionController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auctionRouter = express.Router();

auctionRouter.get("/health", (req, res) => res.json({ status: "ok" }));
auctionRouter.get("/players", asyncHandler(getPlayers));
auctionRouter.get("/teams", asyncHandler(getTeams));
auctionRouter.get("/auction", asyncHandler(getAuction));
auctionRouter.get("/auction-state", asyncHandler(getAuctionState));
auctionRouter.post("/bid", asyncHandler(postBid));
auctionRouter.post("/start-auction", asyncHandler(postStartAuction));
