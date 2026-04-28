import { formatCurrency } from "../constants.js";

export default function UpcomingPlayers({ players }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Upcoming players</p>
      <div className="mt-4 space-y-3">
        {players.length === 0 ? (
          <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-500">No players waiting</p>
        ) : (
          players.map((player) => (
            <div
              key={player._id}
              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 transition"
            >
              <div>
                <p className="font-semibold text-slate-950">{player.name}</p>
                <p className="text-xs capitalize text-slate-500">{player.skill}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(player.basePrice)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
