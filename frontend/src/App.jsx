import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuctionState, placeBid, startAuction } from "./api.js";
import AuctionControls from "./components/AuctionControls.jsx";
import BidControls from "./components/BidControls.jsx";
import CurrentPlayerCard from "./components/CurrentPlayerCard.jsx";
import TeamRosters from "./components/TeamRosters.jsx";
import UpcomingPlayers from "./components/UpcomingPlayers.jsx";
import { formatCurrency } from "./constants.js";

export default function App() {
  const [auction, setAuction] = useState(null);
  const [teams, setTeams] = useState([]);
  const [nextPlayers, setNextPlayers] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const loadAuction = useCallback(async ({ quiet = false } = {}) => {
    try {
      const data = await getAuctionState();
      setAuction(data.auction);
      setTeams(data.teams);
      setNextPlayers(data.nextPlayers || []);
      if (!quiet) {
        setError("");
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    loadAuction();
    const intervalId = window.setInterval(() => loadAuction({ quiet: true }), 1000);
    return () => window.clearInterval(intervalId);
  }, [loadAuction]);

  const leadingTeam = useMemo(() => auction?.leadingTeam, [auction?.leadingTeam]);

  async function runAction(action, successMessage) {
    setIsBusy(true);
    setError("");
    setNotice("");

    try {
      await action();
      setNotice(successMessage);
      await loadAuction({ quiet: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsBusy(false);
    }
  }

  function handleBid(team, amount) {
    runAction(
      () => placeBid(team._id, amount),
      `${team.name} is leading at ${formatCurrency(amount)}.`
    );
  }

  function handleStartAuction() {
    runAction(startAuction, "Auction started.");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">IIIT Nagpur Premier League</h1>
            <p className="text-sm text-slate-600">Real-time player bidding room</p>
          </div>
          <div className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {auction?.auctionStatus === "ONGOING"
              ? leadingTeam ? `Leader: ${leadingTeam.name}` : "Live: waiting for first bid"
              : auction?.auctionStatus === "NOT_STARTED" ? "Auction not started" : "Auction ended"}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {(error || notice) && (
          <div
            className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${
              error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <AuctionControls
              auctionStatus={auction?.auctionStatus || "NOT_STARTED"}
              onStart={handleStartAuction}
              isBusy={isBusy}
            />
            <CurrentPlayerCard auction={auction} />
            <TeamRosters teams={teams} leadingTeamId={leadingTeam?._id} />
          </div>

          <div className="space-y-5">
            <BidControls
              auction={auction}
              teams={teams}
              onBid={handleBid}
              isBusy={isBusy}
            />
            <UpcomingPlayers players={nextPlayers} />
          </div>
        </div>
      </main>
    </div>
  );
}
