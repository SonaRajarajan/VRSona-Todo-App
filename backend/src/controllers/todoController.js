const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../middleware/db");

const VALID_STATUSES   = ["TODO", "DOING", "DONE"];
const VALID_PRIORITIES = ["low", "medium", "high"];

// ─────────────────────────────────────────────────────────────
// GET /api/todos
// Query: workspaceId, status, priority, search
// ─────────────────────────────────────────────────────────────
const getAllTodos = (req, res) => {
  const db = readDB();
  let todos = db.todos;

  const { workspaceId, status, priority, search } = req.query;

  if (workspaceId) {
    todos = todos.filter((t) => t.workspaceId === workspaceId);
  }
  if (status) {
    todos = todos.filter((t) => t.status === status.toUpperCase());
  }
  if (priority) {
    todos = todos.filter((t) => t.priority === priority.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q)) ||
        (t.assignee || "").toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: todos.length, data: todos });
};

// ─────────────────────────────────────────────────────────────
// GET /api/todos/stats
// Query: workspaceId (optional)
// ─────────────────────────────────────────────────────────────
const getTodoStats = (req, res) => {
  const db = readDB();
  const { workspaceId } = req.query;
  let todos = workspaceId
    ? db.todos.filter((t) => t.workspaceId === workspaceId)
    : db.todos;

  res.json({
    success: true,
    data: {
      total: todos.length,
      byStatus: {
        TODO:  todos.filter((t) => t.status === "TODO").length,
        DOING: todos.filter((t) => t.status === "DOING").length,
        DONE:  todos.filter((t) => t.status === "DONE").length
      },
      byPriority: {
        high:   todos.filter((t) => t.priority === "high").length,
        medium: todos.filter((t) => t.priority === "medium").length,
        low:    todos.filter((t) => t.priority === "low").length
      }
    }
  });
};

// ─────────────────────────────────────────────────────────────
// GET /api/todos/:id
// ─────────────────────────────────────────────────────────────
const getTodoById = (req, res) => {
  const db   = readDB();
  const todo = db.todos.find((t) => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ success: false, error: "Todo not found" });
  }
  res.json({ success: true, data: todo });
};

// ─────────────────────────────────────────────────────────────
// POST /api/todos
// ─────────────────────────────────────────────────────────────
const createTodo = (req, res) => {
  const {
    title,
    description  = "",
    workspaceId,
    boardName    = "Untitled Board",
    status       = "TODO",
    priority     = "medium",
    color        = "#FFBB00",
    startTime    = "",
    endTime      = "",
    tags         = [],
    assignee     = "",
    dueDate      = null
  } = req.body;

  // Validation
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: "title is required" });
  }
  if (!workspaceId) {
    return res.status(400).json({ success: false, error: "workspaceId is required" });
  }
  if (!VALID_STATUSES.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`
    });
  }
  if (!VALID_PRIORITIES.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `priority must be one of: ${VALID_PRIORITIES.join(", ")}`
    });
  }

  const db = readDB();

  // Workspace must exist
  if (!db.workspaces.find((w) => w.id === workspaceId)) {
    return res.status(404).json({ success: false, error: "Workspace not found" });
  }

  const newTodo = {
    id:          `todo-${uuidv4()}`,
    workspaceId,
    boardName,
    title:       title.trim(),
    description,
    status:      status.toUpperCase(),
    priority:    priority.toLowerCase(),
    color,
    startTime,
    endTime,
    tags:        Array.isArray(tags) ? tags : [],
    assignee,
    dueDate,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString()
  };

  db.todos.push(newTodo);
  writeDB(db);

  res.status(201).json({ success: true, data: newTodo });
};

// ─────────────────────────────────────────────────────────────
// PUT /api/todos/:id  — full update
// ─────────────────────────────────────────────────────────────
const updateTodo = (req, res) => {
  const db  = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Todo not found" });
  }

  const { status, priority } = req.body;

  if (status && !VALID_STATUSES.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`
    });
  }
  if (priority && !VALID_PRIORITIES.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `priority must be one of: ${VALID_PRIORITIES.join(", ")}`
    });
  }

  const updated = {
    ...db.todos[idx],
    ...req.body,
    // normalise enums
    status:    (req.body.status    ?? db.todos[idx].status).toUpperCase(),
    priority:  (req.body.priority  ?? db.todos[idx].priority).toLowerCase(),
    // immutable fields
    id:        db.todos[idx].id,
    createdAt: db.todos[idx].createdAt,
    updatedAt: new Date().toISOString()
  };

  db.todos[idx] = updated;
  writeDB(db);
  res.json({ success: true, data: updated });
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/todos/:id/status  — lightweight status-only update
// ─────────────────────────────────────────────────────────────
const updateTodoStatus = (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`
    });
  }

  const db  = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Todo not found" });
  }

  db.todos[idx].status    = status.toUpperCase();
  db.todos[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ success: true, data: db.todos[idx] });
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/todos/:id
// ─────────────────────────────────────────────────────────────
const deleteTodo = (req, res) => {
  const db  = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Todo not found" });
  }
  const deleted = db.todos.splice(idx, 1)[0];
  writeDB(db);
  res.json({ success: true, message: "Todo deleted", data: deleted });
};

module.exports = {
  getAllTodos,
  getTodoStats,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo
};
