import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasks.js";

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.use("/api/tasks", taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, _req, res, _next) => {
  if (error.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({ error: error.message });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "An unexpected server error occurred." });
});

const port = Number(process.env.PORT) || 5000;

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Set it in server/.env.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Could not start the API:", error.message);
  process.exit(1);
});

