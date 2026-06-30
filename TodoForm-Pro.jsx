import { useState } from 'react';
import '../styles/TodoForm-Pro.css';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [showForm, setShowForm] = useState(false);

  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState('');

  const colors = [
    { code: '#DBEAFE', name: 'Blue' },
    { code: '#FED7AA', name: 'Orange' },
    { code: '#FECACA', name: 'Red' },
    { code: '#BBEFB8', name: 'Green' },
    { code: '#DDD6FE', name: 'Purple' },
    { code: '#FBCFE8', name: 'Pink' },
    { code: '#FCA5A5', name: 'Rose' },
    { code: '#A7F3D0', name: 'Teal' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task name');
      return;
    }

    onAddTodo({
      title: title.trim(),
      color: selectedColor,
      completed: false,
      priority: 'medium',
      subtasks: [],
      dueDate,
      time: dueTime,
      description
    });

    // Reset form
    setTitle('');
    setSelectedColor('#DBEAFE');
    setDueDate('');
    setDueTime('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="todo-form-container">
      {!showForm ? (
        <button
          className="add-task-trigger"
          onClick={() => setShowForm(true)}
        >
          <span className="plus-icon">+</span>
          <span>Add a new task</span>
        </button>
      ) : (
        <form className="todo-form-pro" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>New Task</h3>

            <button
              type="button"
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>

          {/* Task Title */}
          <div className="form-group">
            <input
              type="text"
              className="todo-input-pro"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Task Description</label>

            <textarea
              className="todo-textarea"
              rows="3"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              className="todo-input-pro"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Due Time */}
          <div className="form-group">
            <label>Due Time</label>

            <input
              type="time"
              className="todo-input-pro"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>

          {/* Color Picker */}
          <div className="form-section">
            <label className="section-label">Color</label>

            <div className="color-picker-pro">
              {colors.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  className={`color-dot-pro ${
                    selectedColor === color.code ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setSelectedColor(color.code)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TodoForm;