import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { auctionRouter } from "./routes/auctionRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like Postman/curl, plus the local Vite frontend.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  })
);
app.use(express.json());
app.use("/api", auctionRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong."
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`NPL backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
