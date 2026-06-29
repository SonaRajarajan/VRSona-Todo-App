import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import '../styles/DashboardPage.css';

function DashboardPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [userData, setUserData] = useState({ name: '', age: '' });
  const navigate = useNavigate();

  // Get user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    } else {
      navigate('/');
    }
    fetchTodos();
  }, [navigate]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE'
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Calculate statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="dashboard-page">
      {/* Header with User Profile */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-profile">
            <div className="user-avatar">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <h1>{userData.name || 'User'}</h1>
              <p className="user-role">Task Manager</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        {/* Statistics Section */}
        <section className="stats-section">
          <h2>My Tasks</h2>
          <div className="stats-grid">
            <div className="stat-card stat-pending">
              <div className="stat-icon">📝</div>
              <div className="stat-details">
                <h3>{stats.pending}</h3>
                <p>To Do</p>
              </div>
            </div>

            <div className="stat-card stat-in-progress">
              <div className="stat-icon">⏳</div>
              <div className="stat-details">
                <h3>{stats.high}</h3>
                <p>High Priority</p>
              </div>
            </div>

            <div className="stat-card stat-completed">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div className="stat-card stat-total">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>{stats.total}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Add Task Section */}
        <section className="add-task-section">
          <TodoForm onAddTodo={handleAddTodo} />
        </section>

        {/* Filter Tabs */}
        <section className="tasks-section">
          <div className="section-header">
            <h2>All Tasks</h2>
            <div className="filter-tabs">
              <button
                className={`tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`tab ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`tab ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="todos-container">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  onToggle={() => handleToggleTodo(todo.id, todo.completed)}
                  onClick={() => navigate(`/todo/${todo.id}`)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No {filter === 'completed' ? 'completed' : filter === 'active' ? 'active' : ''} tasks</h3>
                <p>
                  {filter === 'completed'
                    ? 'Complete some tasks to see them here'
                    : filter === 'active'
                    ? 'Great job! No active tasks'
                    : 'Add a new task to get started'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
