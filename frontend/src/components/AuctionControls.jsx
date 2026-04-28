export default function AuctionControls({ auctionStatus, onStart, isBusy }) {
  const isNotStarted = auctionStatus === "NOT_STARTED";
  const isOngoing = auctionStatus === "ONGOING";

  return (
    <section
      className={`rounded-lg border p-6 shadow-sm ${
        isOngoing ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Auction control</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            {isOngoing ? "Auction live" : isNotStarted ? "Auction not started" : "Auction ended"}
          </h2>
          <p className="text-sm text-slate-600">
            {isOngoing
              ? "Bids are open and each valid bid resets the timer."
              : isNotStarted
                ? "Start the auction when teams are ready."
                : "All available players have been processed."}
          </p>
        </div>

        {isNotStarted && (
          <button
            type="button"
            disabled={isBusy}
            onClick={onStart}
            className="rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Start Auction
          </button>
        )}
      </div>
    </section>
  );
}
