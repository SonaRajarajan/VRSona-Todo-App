const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../middleware/db");

// ─────────────────────────────────────────────────────────────
// GET /api/workspaces
// ─────────────────────────────────────────────────────────────
const getAllWorkspaces = (_req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.workspaces.length, data: db.workspaces });
};

// ─────────────────────────────────────────────────────────────
// GET /api/workspaces/:id
// ─────────────────────────────────────────────────────────────
const getWorkspaceById = (req, res) => {
  const db = readDB();
  const workspace = db.workspaces.find((w) => w.id === req.params.id);
  if (!workspace) {
    return res.status(404).json({ success: false, error: "Workspace not found" });
  }
  const todoCount = db.todos.filter((t) => t.workspaceId === workspace.id).length;
  res.json({ success: true, data: { ...workspace, todoCount } });
};

// ─────────────────────────────────────────────────────────────
// POST /api/workspaces
// ─────────────────────────────────────────────────────────────
const createWorkspace = (req, res) => {
  const { name, color = "#FFBB00", icon = "📁" } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: "name is required" });
  }

  const db = readDB();
  const newWorkspace = {
    id:          `ws-${uuidv4()}`,
    name:        name.trim(),
    color,
    icon,
    memberCount: 1,
    createdAt:   new Date().toISOString()
  };

  db.workspaces.push(newWorkspace);
  writeDB(db);
  res.status(201).json({ success: true, data: newWorkspace });
};

// ─────────────────────────────────────────────────────────────
// PUT /api/workspaces/:id
// ─────────────────────────────────────────────────────────────
const updateWorkspace = (req, res) => {
  const db  = readDB();
  const idx = db.workspaces.findIndex((w) => w.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Workspace not found" });
  }

  db.workspaces[idx] = {
    ...db.workspaces[idx],
    ...req.body,
    id:        db.workspaces[idx].id,        // immutable
    createdAt: db.workspaces[idx].createdAt  // immutable
  };

  writeDB(db);
  res.json({ success: true, data: db.workspaces[idx] });
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/workspaces/:id
// Also removes all todos that belong to this workspace
// ─────────────────────────────────────────────────────────────
const deleteWorkspace = (req, res) => {
  const db  = readDB();
  const idx = db.workspaces.findIndex((w) => w.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Workspace not found" });
  }

  const deleted     = db.workspaces.splice(idx, 1)[0];
  const removedCount = db.todos.filter((t) => t.workspaceId === req.params.id).length;
  db.todos           = db.todos.filter((t) => t.workspaceId !== req.params.id);

  writeDB(db);
  res.json({
    success: true,
    message: `Workspace deleted along with ${removedCount} todo(s)`,
    data: deleted
  });
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
};
