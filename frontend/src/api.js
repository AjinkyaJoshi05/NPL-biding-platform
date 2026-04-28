const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function getAuctionState() {
  return request("/auction-state");
}

export function startAuction() {
  return request("/start-auction", { method: "POST" });
}

export function getPlayers() {
  return request("/players");
}

export function getTeams() {
  return request("/teams");
}

export function placeBid(teamId, amount) {
  return request("/bid", {
    method: "POST",
    body: JSON.stringify({ teamId, amount })
  });
}
