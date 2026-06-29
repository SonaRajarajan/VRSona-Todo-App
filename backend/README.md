# ToDoDo — Backend API

Express.js REST API for the ToDoDo task management app.  
Data is stored in `src/data/db.json` (auto-created with seed data on first run).

---

## Stack

| | |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js 4 |
| Storage | JSON flat-file (`db.json`) |
| IDs | `uuid` v4 |
| Dev server | `nodemon` |

---

## Folder structure

```
backend/
├── src/
│   ├── index.js                   ← Express app, middleware, server boot
│   ├── controllers/
│   │   ├── todoController.js      ← Todo business logic
│   │   └── workspaceController.js ← Workspace business logic
│   ├── routes/
│   │   ├── todos.js               ← /api/todos  routes
│   │   └── workspaces.js          ← /api/workspaces  routes
│   ├── middleware/
│   │   └── db.js                  ← readDB / writeDB helpers + seed
│   └── data/
│       └── db.json                ← Auto-generated (gitignored)
├── .vscode/
│   ├── extensions.json            ← Recommended extensions
│   └── launch.json                ← Nodemon debug config
├── api.http                       ← REST Client test file
├── .gitignore
└── package.json
```

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # start with nodemon (auto-restart on save)
npm start        # start without nodemon (production)
```

Server → `http://localhost:5000`

---

## API reference

### Base URL
```
http://localhost:5000/api
```

---

### Health
| Method | Endpoint | |
|---|---|---|
| GET | `/health` | Server status check |

---

### Workspaces `/api/workspaces`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/workspaces` | List all workspaces |
| GET | `/workspaces/:id` | Get one workspace (includes `todoCount`) |
| POST | `/workspaces` | Create a workspace |
| PUT | `/workspaces/:id` | Update a workspace |
| DELETE | `/workspaces/:id` | Delete workspace **and all its todos** |

**POST / PUT body fields**

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | string | ✅ | — |
| `color` | hex string | ❌ | `#FFBB00` |
| `icon` | emoji | ❌ | `📁` |

---

### Todos `/api/todos`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/todos` | List todos (filterable) |
| GET | `/todos/stats` | Counts by status & priority |
| GET | `/todos/:id` | Get one todo |
| POST | `/todos` | Create a todo |
| PUT | `/todos/:id` | Full update |
| PATCH | `/todos/:id/status` | Update status only |
| DELETE | `/todos/:id` | Delete a todo |

**GET /todos — query params**

| Param | Values | Example |
|---|---|---|
| `workspaceId` | any workspace id | `?workspaceId=ws-1` |
| `status` | `TODO` `DOING` `DONE` | `?status=DOING` |
| `priority` | `low` `medium` `high` | `?priority=high` |
| `search` | free text | `?search=meeting` |

**POST /todos body**

```json
{
  "title":       "Design landing page",
  "workspaceId": "ws-1",
  "description": "Wireframes for the homepage",
  "boardName":   "Design Board",
  "status":      "TODO",
  "priority":    "high",
  "color":       "#9B59B6",
  "startTime":   "09:00",
  "endTime":     "11:00",
  "tags":        ["design", "web"],
  "assignee":    "Sona",
  "dueDate":     "2025-12-31T00:00:00.000Z"
}
```

**Todo object shape**

```json
{
  "id":          "todo-uuid",
  "workspaceId": "ws-1",
  "boardName":   "Untitled Board",
  "title":       "Meeting with HT Team",
  "description": "Talk about product design",
  "status":      "DOING",
  "priority":    "high",
  "color":       "#FFBB00",
  "startTime":   "07:00",
  "endTime":     "08:00",
  "tags":        ["meeting", "design"],
  "assignee":    "Alice",
  "dueDate":     "2025-12-01T00:00:00.000Z",
  "createdAt":   "2025-11-01T10:00:00.000Z",
  "updatedAt":   "2025-11-01T10:00:00.000Z"
}
```

---

## Error shape

```json
{ "success": false, "error": "Descriptive message" }
```

| Code | Meaning |
|---|---|
| 400 | Validation failed |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Test in VS Code

1. Install **REST Client** extension (`humao.rest-client`)
2. Open `api.http`
3. Click **Send Request** above any block
