const express = require("express");
const router  = express.Router();
const {
  getAllTodos,
  getTodoStats,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo
} = require("../controllers/todoController");

// Stats must be declared before /:id to avoid conflict
router.get("/stats",         getTodoStats);

router.get("/",              getAllTodos);
router.get("/:id",           getTodoById);
router.post("/",             createTodo);
router.put("/:id",           updateTodo);
router.patch("/:id/status",  updateTodoStatus);
router.delete("/:id",        deleteTodo);

module.exports = router;
