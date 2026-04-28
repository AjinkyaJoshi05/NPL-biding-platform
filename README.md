# IIIT Nagpur Premier League (NPL) Bidding System

A simple full-stack player auction prototype for the IIIT Nagpur Premier League. It uses React, Tailwind CSS, Node.js, Express, MongoDB, and Mongoose.

## Project Folder Structure

```text
.
├── backend
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   └── auctionController.js
│       ├── data
│       │   ├── players.js
│       │   └── teams.js
│       ├── models
│       │   ├── AuctionState.js
│       │   ├── Player.js
│       │   └── Team.js
│       ├── routes
│       │   └── auctionRoutes.js
│       ├── seed
│       │   └── seed.js
│       ├── services
│       │   └── auctionService.js
│       ├── utils
│       │   └── asyncHandler.js
│       └── server.js
├── frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── src
│       ├── App.jsx
│       ├── api.js
│       ├── components
│       │   ├── AuctionControls.jsx
│       │   ├── BidControls.jsx
│       │   ├── CurrentPlayerCard.jsx
│       │   ├── PlayerStats.jsx
│       │   ├── UpcomingPlayers.jsx
│       │   └── TeamRosters.jsx
│       ├── constants.js
│       ├── main.jsx
│       └── styles.css
├── .gitignore
├── package.json
└── README.md
```

## Backend Code

The backend lives in `backend/src`.

- `models/Player.js`: player schema with name, skill, base price, sale status, sold team, and sold price.
- `models/Team.js`: team schema with manager name, budget, spent amount, and roster.
- `models/AuctionState.js`: current player, current bid, leading team, auction status, bid history, and timer state.
- `models/Player.js`: player schema with skill, base price, sale data, and stats.
- `services/auctionService.js`: auction logic for picking players, placing bids, resetting timers, and auto-finalizing expired rounds.
- `controllers/auctionController.js`: request handlers.
- `routes/auctionRoutes.js`: API route registration.
- `seed/seed.js`: resets MongoDB and loads sample players and 4 teams.

### API Endpoints

All API routes are prefixed with `/api`.

```text
GET  /api/players
POST /api/bid
POST /api/start-auction
GET  /api/teams
GET  /api/auction
GET  /api/auction-state
GET  /api/health
```

`GET /api/auction-state` is the main polling endpoint used by the UI. It returns `auction`, `currentPlayer`, `nextPlayers`, and `teams`.

## Frontend Code

The frontend lives in `frontend/src`.

- `App.jsx`: dashboard state, polling, and action handlers.
- `api.js`: fetch helpers for backend calls.
- `AuctionControls.jsx`: start button and auction status display.
- `CurrentPlayerCard.jsx`: active player and timer.
- `BidControls.jsx`: live bid display, increment buttons, custom bid input, and team bid buttons.
- `PlayerStats.jsx`: compact player stats grid.
- `UpcomingPlayers.jsx`: next players queue.
- `TeamRosters.jsx`: sold players and team budgets.

The UI uses polling every 1 second for live updates. No Redux is used; state stays in React hooks.

## Setup Steps

### 1. Prerequisites

- Node.js 20+
- MongoDB running locally
  
### 2. Install Dependencies

```bash
npm run install:all
```

If you want the root `npm run dev` script, also install the root helper dependency:

```bash
npm install
```

### 3. Configure Environment

Create backend and frontend env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` if your MongoDB connection is different:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/npl_bidding
CLIENT_URL=http://localhost:5173
AUCTION_TIMER_SECONDS=20
```

### 4. Seed MongoDB

```bash
npm run seed
```

This creates 12 players, 4 teams, and the initial auction state.

### 5. Run the App

Run both apps together from the root:

```bash
npm run dev
```

The root dev command runs the backend plus the built frontend with `frontend/static-server.js`. This avoids Vite dev-server issues on Windows.

Or run them in separate terminals:

```bash
npm run dev --prefix backend
npm run serve --prefix frontend
```

Open the frontend at:

```text
http://localhost:5173
```

On some Windows setups, Vite dev mode can fail with `spawn EPERM`. If you specifically want Vite dev mode, use:

```bash
npm run dev:vite
```

Backend runs at:

```text
http://localhost:5000/api
```

## Auction Flow

1. The page loads in `NOT_STARTED` state with the first player visible.
2. Click `Start Auction` to begin the 20-second timer.
3. Teams can bid using `+50`, `+100`, `+500`, `+1000`, or a custom amount.
4. A valid bid must be greater than the current bid.
5. Every valid bid updates the current bid, sets the leading team, and resets the timer to 20 seconds.
6. When the timer reaches 0, the backend automatically sells the player to the leading team and moves to the next player.
7. If no team bids before the timer ends, the player is marked unsold and the next player starts.

## Notes

- There is no authentication by design.
- The timer is stored as a backend deadline and returned as `timeLeft`.
- Bidding is disabled unless `auctionStatus` is `ONGOING`.
- Polling is used instead of WebSockets to keep the prototype easy to run and review.
