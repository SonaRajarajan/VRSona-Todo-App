const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/todos.json');

// Ensure data file exists
const ensureDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// Read todos from file
const readTodos = async () => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
};

// Write todos to file
const writeTodos = async (todos) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error writing todos:', error);
  }
};

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await readTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Get single todo
exports.getTodoById = async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find(t => t.id === req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// Create new todo
exports.createTodo = async (req, res) => {
  try {
    const todos = await readTodos();
    const newTodo = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description || '',
      color: req.body.color || '#DBEAFE',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || '',
      time: req.body.time || '',
      completed: req.body.completed || false,
      subtasks: req.body.subtasks || [],
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await writeTodos(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update todo
exports.updateTodo = async (req, res) => {
  try {
    const todos = await readTodos();
    const index = todos.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[index] = {
      ...todos[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await writeTodos(todos);
    res.json(todos[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const todos = await readTodos();
    const filteredTodos = todos.filter(t => t.id !== req.params.id);

    if (filteredTodos.length === todos.length) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await writeTodos(filteredTodos);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Add subtask
exports.addSubtask = async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find(t => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const newSubtask = {
      id: Date.now().toString(),
      title: req.body.title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (!todo.subtasks) {
      todo.subtasks = [];
    }

    todo.subtasks.push(newSubtask);
    await writeTodos(todos);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add subtask' });
  }
};

// Toggle subtask completion
exports.toggleSubtask = async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find(t => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const subtask = todo.subtasks.find(s => s.id === req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    await writeTodos(todos);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle subtask' });
  }
};

// Delete subtask
exports.deleteSubtask = async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find(t => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.subtasks = todo.subtasks.filter(s => s.id !== req.params.subtaskId);
    await writeTodos(todos);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
};
