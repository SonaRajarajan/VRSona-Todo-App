const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Get all todos
router.get('/', todoController.getAllTodos);

// Get single todo by id
router.get('/:id', todoController.getTodoById);

// Create new todo
router.post('/', todoController.createTodo);

// Update todo
router.put('/:id', todoController.updateTodo);

// Delete todo
router.delete('/:id', todoController.deleteTodo);

// Subtasks routes
router.post('/:id/subtasks', todoController.addSubtask);
router.put('/:id/subtasks/:subtaskId', todoController.toggleSubtask);
router.delete('/:id/subtasks/:subtaskId', todoController.deleteSubtask);

module.exports = router;
