import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Plus, LogOut, Calendar, AlertTriangle } from 'lucide-react';

function DashboardPage({ todos = [], setTodos }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [userData, setUserData] = useState({ name: 'User' });

  const today = new Date();

  // Load user data
  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  // Calculations
  const overdueTasks = todos.filter(todo => 
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < today
  );

  const dueToday = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const due = new Date(todo.dueDate);
    return due.getDate() === today.getDate() &&
           due.getMonth() === today.getMonth() &&
           due.getFullYear() === today.getFullYear();
  });

  const dueSoon = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const diff = (new Date(todo.dueDate) - today) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  });

  // Calculate statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
    overdue: overdueTasks.length
  };

  const completionRate = todos.length === 0 ? 0 : 
    Math.round((stats.completed / todos.length) * 100);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  const toggleComplete = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
function TodoListPage({
  todos, setTodos, updateTodo, addActivity,
  toggleComplete, dismissedAlerts, dismissAlert,
}) {
  const navigate = useNavigate();
  const [newTodo, setNewTodo] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [filter, setFilter] = useState('all');

  const now = new Date();

  const overdueTodos = todos.filter(t => {
    if (t.completed || !t.dueDate || dismissedAlerts.includes(t.id)) return false;
    return new Date(`${t.dueDate}T${t.dueTime || '23:59'}`) < now;
  });

  const dueSoonTodos = todos.filter(t => {
    if (t.completed || !t.dueDate || dismissedAlerts.includes(t.id)) return false;
    const diff = (new Date(`${t.dueDate}T${t.dueTime || '23:59'}`) - now) / (1000 * 60 * 60);
    return diff > 0 && diff <= 24;
  });

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      description: '',
      completed: false,
      color: selectedColor,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      priority: 'medium',
      subtasks: [],
      notes: '',
      timeSpent: 0,
      activity: [{ id: Date.now(), action: 'created', details: '', timestamp: new Date().toISOString() }],
    };
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
    setSelectedColor('blue');
  };

  const deleteTodo = (id) => setTodos(prev => prev.filter(t => t.id !== id));

  const filteredTodos = filter === 'active' ? todos.filter(t => !t.completed) :
                       filter === 'completed' ? todos.filter(t => t.completed) :
                       todos;

  return (
    <div style={{ minHeight: '100vh', background: '#4F46E5', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', color: 'white' }}>
            To<span style={{ color: '#F97316' }}>Do</span>Do
          </h1>
          {overdueTodos.length > 0 && (
            <div style={{ background: '#EF4444', color: '#fff', padding: '6px 16px', borderRadius: '9999px', fontWeight: '700' }}>
              <AlertTriangle size={16} style={{ display: 'inline' }} /> {overdueTodos.length} Overdue
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Sidebar */}
          <div style={{ width: '300px', background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>Priority Tasks</h3>
            {overdueTodos.length > 0 && <div>Overdue: {overdueTodos.length}</div>}
            {dueSoonTodos.length > 0 && <div>Due Soon: {dueSoonTodos.length}</div>}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            {/* Add New Todo */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="What needs to be done?"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}
              />
              <button onClick={addTodo} style={{ padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px' }}>
                Add Task
              </button>
            </div>

            {/* Todo List */}
            {filteredTodos.length === 0 ? (
              <p style={{ color: 'white', textAlign: 'center', fontSize: '18px' }}>No tasks found</p>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  onClick={() => navigate(`/todo/${todo.id}`)}
                  style={{ background: '#fff', marginBottom: '12px', padding: '16px', borderRadius: '12px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={(e) => { e.stopPropagation(); toggleComplete(todo.id); }}>
                      {todo.completed ? '✅' : '⬜'}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</div>
                      {todo.dueDate && <small>Due: {todo.dueDate}</small>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} style={{ color: 'red' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold">
              {userData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
              <p className="text-gray-500">Your personal task manager</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/analytics"
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
            >
              <BarChart3 size={20} />
              Analytics
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-5xl mb-4">📊</div>
            <div className="text-4xl font-bold">{stats.total}</div>
            <div className="text-gray-500">Total Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-5xl mb-4">✅</div>
            <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-500">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-5xl mb-4">⏳</div>
            <div className="text-4xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-5xl mb-4">🔥</div>
            <div className="text-4xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-gray-500">Overdue</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow lg:col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-4xl font-bold text-purple-600">{completionRate}%</div>
                <div className="text-gray-500">Completion Rate</div>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-purple-100 border-t-purple-600 flex items-center justify-center text-2xl">
                🎯
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => navigate('/todos')}
            className="flex-1 bg-blue-600 text-white py-5 rounded-3xl text-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
          >
            <Plus size={28} /> Manage All Tasks
          </button>
          <Link
            to="/analytics"
            className="flex-1 bg-white border-2 border-purple-600 text-purple-700 py-5 rounded-3xl text-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-3"
          >
            <BarChart3 size={28} /> View Full Analytics
          </Link>
        </div>

        {/* Tasks Preview */}
        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Recent Tasks</h2>
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.slice(0, 6).map(todo => (
                <div
                  key={todo.id}
                  onClick={() => navigate(`/todo/${todo.id}`)}
                  className="p-6 border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-lg pr-4">{todo.text}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComplete(todo.id); }}
                      className="text-2xl"
                    >
                      {todo.completed ? '✅' : '⬜'}
                    </button>
                  </div>
                  {todo.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{todo.description}</p>}
                  {todo.dueDate && (
                    <p className="text-xs mt-4 text-gray-400 flex items-center gap-1">
                      <Calendar size={14} /> Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-gray-400">
                No tasks found. <br /> Start adding tasks from the Tasks page.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;