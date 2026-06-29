const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
const workspaceRoutes = require("./routes/workspaces");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.url}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/todos", todoRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀  ToDoDo API  →  http://localhost:${PORT}/api`);
  console.log(`💚  Health      →  http://localhost:${PORT}/api/health\n`);
});
