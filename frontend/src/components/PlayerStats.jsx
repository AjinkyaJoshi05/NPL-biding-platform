const statItems = [
  { key: "matchesPlayed", label: "Matches" },
  { key: "runsScored", label: "Runs" },
  { key: "wicketsTaken", label: "Wickets" },
  { key: "strikeRate", label: "Strike rate" }
];

export default function PlayerStats({ stats = {} }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.key} className="rounded-md bg-slate-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-1 text-xl font-bold text-slate-950">{stats[item.key] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
