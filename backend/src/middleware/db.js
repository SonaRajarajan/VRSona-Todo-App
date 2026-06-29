const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");

// ─── Seed data (written once on first boot) ───────────────────
const SEED = {
  workspaces: [
    {
      id: "ws-1",
      name: "My Team",
      color: "#FFBB00",
      icon: "👥",
      memberCount: 14,
      createdAt: new Date().toISOString()
    },
    {
      id: "ws-2",
      name: "Lay Workspace",
      color: "#FF5733",
      icon: "🏢",
      memberCount: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: "ws-3",
      name: "Slack Team",
      color: "#4A154B",
      icon: "💬",
      memberCount: 28,
      createdAt: new Date().toISOString()
    }
  ],
  todos: [
    {
      id: "todo-1",
      workspaceId: "ws-1",
      boardName: "Untitled Board",
      title: "Meeting with HT Team",
      description: "Talk about product design",
      status: "DOING",
      priority: "high",
      color: "#FFBB00",
      startTime: "07:00",
      endTime: "08:00",
      tags: ["meeting", "design"],
      assignee: "Alice",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "todo-2",
      workspaceId: "ws-1",
      boardName: "Untitled Board",
      title: "Boxing in the Morning",
      description: "Cardio workout play",
      status: "DOING",
      priority: "medium",
      color: "#FF5733",
      startTime: "07:00",
      endTime: "08:00",
      tags: ["fitness", "health"],
      assignee: "Bob",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "todo-3",
      workspaceId: "ws-2",
      boardName: "Untitled Board",
      title: "Learn 3D in C4D",
      description: "Design and more on Dribbble",
      status: "TODO",
      priority: "low",
      color: "#27AE60",
      startTime: "07:00",
      endTime: "08:00",
      tags: ["learning", "design"],
      assignee: "Carol",
      dueDate: new Date(Date.now() + 604800000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "todo-4",
      workspaceId: "ws-2",
      boardName: "Untitled Board",
      title: "Meeting with Google Team",
      description: "Talk about visual concept",
      status: "DONE",
      priority: "high",
      color: "#2196F3",
      startTime: "07:00",
      endTime: "08:00",
      tags: ["meeting", "client"],
      assignee: "Dave",
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// ─── Init ─────────────────────────────────────────────────────
function initDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir))     fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2));
    console.log("📂  Database initialised with seed data.");
  }
}

function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
