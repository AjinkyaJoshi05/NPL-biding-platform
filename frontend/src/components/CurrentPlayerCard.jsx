import { formatCurrency } from "../constants.js";
import PlayerStats from "./PlayerStats.jsx";

const skillStyles = {
  batting: "bg-sky-100 text-sky-800",
  bowling: "bg-rose-100 text-rose-800",
  "all-rounder": "bg-emerald-100 text-emerald-800"
};

export default function CurrentPlayerCard({ auction }) {
  const player = auction?.currentPlayer;
  const timeLeft = auction?.timeLeft || 0;
  const isOngoing = auction?.auctionStatus === "ONGOING";
  const isLowTime = timeLeft <= 5 && isOngoing;

  if (!player) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Auction complete</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">All players have been processed.</h2>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Current player</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{player.name}</h2>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${skillStyles[player.skill]}`}
          >
            {player.skill}
          </span>
        </div>

        <div
          className={`rounded-md border px-5 py-4 text-right ${
            isLowTime ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
          }`}
        >
          <p className={`text-sm ${isLowTime ? "text-red-700" : "text-slate-500"}`}>Time left</p>
          <p className={`text-5xl font-black tabular-nums ${isLowTime ? "text-red-700" : "text-slate-950"}`}>
            {isOngoing ? `${timeLeft}s` : "--"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Base price</p>
          <p className="text-2xl font-bold text-slate-950">{formatCurrency(player.basePrice)}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Auction status</p>
          <p className="text-2xl font-bold text-slate-950">{auction?.auctionStatus || "NOT_STARTED"}</p>
        </div>
      </div>

      <PlayerStats stats={player.stats} />
    </section>
  );
}
