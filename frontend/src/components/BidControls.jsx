import { useState } from "react";
import { BID_INCREMENTS, formatCurrency } from "../constants.js";

export default function BidControls({ auction, teams, onBid, isBusy }) {
  const currentBid = auction?.currentBid || 0;
  const leadingTeamId = auction?.leadingTeam?._id;
  const canBid = Boolean(auction?.currentPlayer && auction?.auctionStatus === "ONGOING");
  const [selectedIncrement, setSelectedIncrement] = useState(BID_INCREMENTS[2]);
  const [customBid, setCustomBid] = useState("");

  const nextBid = currentBid + selectedIncrement;
  const customAmount = Number(customBid);
  const hasCustomAmount = Number.isFinite(customAmount) && customAmount > currentBid;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Live bid</p>
      <div className="mt-3 rounded-md bg-slate-950 p-4 text-white">
        <p className="text-sm text-slate-300">Current highest</p>
        <p className="text-4xl font-black">{formatCurrency(currentBid)}</p>
        <p className="mt-1 text-sm text-slate-300">
          {auction?.leadingTeam ? `Leading: ${auction.leadingTeam.name}` : "No team is leading yet"}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {BID_INCREMENTS.map((increment) => (
          <button
            key={increment}
            type="button"
            disabled={!canBid || isBusy}
            onClick={() => setSelectedIncrement(increment)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
              selectedIncrement === increment
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            +{increment}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Custom bid
        <input
          type="number"
          min={currentBid + 1}
          value={customBid}
          onChange={(event) => setCustomBid(event.target.value)}
          placeholder={`More than ${currentBid}`}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
      </label>

      <div className="mt-5 grid gap-3">
        {teams.map((team) => {
          const isLeading = team._id === leadingTeamId;
          const bidAmount = hasCustomAmount ? customAmount : nextBid;

          return (
            <button
              key={team._id}
              type="button"
              disabled={!canBid || isBusy || team.remainingBudget < bidAmount}
              onClick={() => onBid(team, bidAmount)}
              className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left font-semibold transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 ${
                isLeading
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
              }`}
            >
              <span>
                Bid {hasCustomAmount ? formatCurrency(customAmount) : `+${selectedIncrement}`} ({team.name})
              </span>
              <span>{formatCurrency(bidAmount)}</span>
            </button>
          );
        })}
      </div>

      {!canBid && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Bidding unlocks after the auction is started.
        </p>
      )}
    </section>
  );
}
