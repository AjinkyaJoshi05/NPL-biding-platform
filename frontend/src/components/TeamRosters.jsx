import { formatCurrency } from "../constants.js";

export default function TeamRosters({ teams, leadingTeamId }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Team rosters</p>
          <h2 className="text-xl font-bold text-slate-950">Squads and budgets</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {teams.map((team) => (
          <article
            key={team._id}
            className={`rounded-lg border p-4 ${
              team._id === leadingTeamId ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950">{team.name}</h3>
                <p className="text-sm text-slate-500">{team.managerName}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-slate-950">{formatCurrency(team.remainingBudget)}</p>
                <p className="text-slate-500">left</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {team.roster.length === 0 ? (
                <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-500">No players yet</p>
              ) : (
                team.roster.map((item) => (
                  <div
                    key={`${team._id}-${item.player._id}`}
                    className="flex items-center justify-between gap-3 rounded-md bg-slate-100 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-950">{item.player.name}</p>
                      <p className="text-xs capitalize text-slate-500">{item.player.skill}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(item.price)}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
