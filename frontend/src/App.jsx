import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Trash2, CheckCircle2, Circle, Edit2, Tag, Clock, FileText, History, ArrowLeft, Calendar, Flag, LogOut } from 'lucide-react';

// Color palette
const colors = [
  { name: 'blue', bg: '#3B82F6', light: '#E0E7FF', text: '#1E40AF', icon: '●' },
  { name: 'yellow', bg: '#FBBF24', light: '#FEF3C7', text: '#92400E', icon: '●' },
  { name: 'orange', bg: '#F97316', light: '#FFEDD5', text: '#9A3412', icon: '●' },
  { name: 'green', bg: '#10B981', light: '#ECFDF5', text: '#065F46', icon: '●' },
  { name: 'purple', bg: '#8B5CF6', light: '#F3E8FF', text: '#5B21B6', icon: '●' },
  { name: 'pink', bg: '#EC4899', light: '#FCE7F3', text: '#831843', icon: '●' },
  { name: 'red', bg: '#EF4444', light: '#FEE2E2', text: '#7F1D1D', icon: '●' },
  { name: 'teal', bg: '#14B8A6', light: '#F0FDFA', text: '#134E4A', icon: '●' },
];

const priorities = [
  { value: 'low', label: 'Low', icon: '○', color: '#6B7280' },
  { value: 'medium', label: 'Medium', icon: '◐', color: '#F59E0B' },
  { value: 'high', label: 'High', icon: '●', color: '#EF4444' },
];

// Main App with Router
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('userData');
  });
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : getDefaultTodos();
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleLogin = (name, age) => {
    const userData = { name, age };
    localStorage.setItem('userData', JSON.stringify(userData));
    setUserData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setIsLoggedIn(false);
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addActivity = (todoId, action, details = '') => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const activity = {
        id: Date.now(),
        action,
        details,
        timestamp: new Date().toISOString(),
      };
      updateTodo(todoId, {
        activity: [...(todo.activity || []), activity]
      });
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <TodoListPage 
                todos={todos} 
                setTodos={setTodos} 
                updateTodo={updateTodo} 
                addActivity={addActivity}
                userData={userData}
                onLogout={handleLogout}
              />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />

        {/* Protected Todo Routes */}
        <Route
          path="/todo/:id"
          element={
            isLoggedIn ? (
              <TodoDetailPage 
                todos={todos} 
                updateTodo={updateTodo} 
                addActivity={addActivity}
                userData={userData}
                onLogout={handleLogout}
              />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// LOGIN PAGE
function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 13) {
      newErrors.age = 'Age must be at least 13';
    } else if (age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    return newErrors;
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert(Object.values(newErrors).join('\n'));
    } else {
      onLogin(name, age);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'inherit' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          {/* Left Side */}
          <div style={{ color: 'white', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '20px', fontSize: '40px', marginBottom: '20px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
                ✓
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '20px 0 10px', letterSpacing: '-1px' }}>
                <span style={{ color: '#4F46E5' }}>To</span>
                <span style={{ color: '#F59E0B' }}>Do</span>
                <span style={{ color: '#10B981' }}>Do</span>
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>Your Personal Task Manager</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: '📋', title: 'Organize Tasks', desc: 'Keep all your tasks in one place' },
                { icon: '🎯', title: 'Set Priorities', desc: 'Focus on what matters most' },
                { icon: '📊', title: 'Track Progress', desc: 'Monitor your productivity' }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{feature.icon}</div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{feature.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div style={{ background: 'white', padding: '50px 40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: '#1F2937' }}>Welcome to ToDoDo</h2>
            <p style={{ color: '#6B7280', margin: '0 0 30px 0', fontSize: '14px' }}>Let's get you started</p>

            <form onSubmit={handleGetStarted} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  style={{
                    padding: '14px 16px',
                    border: errors.name ? '2px solid #EF4444' : '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    background: errors.name ? 'rgba(239, 68, 68, 0.05)' : '#F9FAFB',
                    outline: 'none',
                  }}
                />
                {errors.name && <span style={{ color: '#EF4444', fontSize: '13px', fontWeight: '500' }}>{errors.name}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600', color: '#1F2937', fontSize: '14px' }}>Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  min="13"
                  max="120"
                  style={{
                    padding: '14px 16px',
                    border: errors.age ? '2px solid #EF4444' : '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    background: errors.age ? 'rgba(239, 68, 68, 0.05)' : '#F9FAFB',
                    outline: 'none',
                  }}
                />
                {errors.age && <span style={{ color: '#EF4444', fontSize: '13px', fontWeight: '500' }}>{errors.age}</span>}
              </div>

              <button
                type="submit"
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '10px',
                }}
              >
                Get Started →
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', marginTop: '10px' }}>
              You're all set to manage your tasks like a pro!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultTodos() {
  return [
    {
      id: 1,
      text: 'Meeting with HT Team',
      description: 'Discuss Q1 project roadmap and deliverables',
      completed: false,
      color: 'yellow',
      dueDate: '2024-01-15',
      dueTime: '14:00',
      priority: 'high',
      subtasks: [
        { id: 1, text: 'Prepare presentation slides', completed: true },
        { id: 2, text: 'Review budget allocation', completed: false },
        { id: 3, text: 'Collect team feedback', completed: false },
      ],
      notes: 'Conference room B, bring printed agenda',
      timeSpent: 45,
      activity: [
        { id: 1, action: 'created', details: '', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, action: 'edited', details: 'Added description', timestamp: new Date(Date.now() - 43200000).toISOString() },
      ],
    },
    {
      id: 2,
      text: 'Coding in the Morning',
      description: 'Complete React component refactoring',
      completed: false,
      color: 'orange',
      dueDate: '2024-01-16',
      dueTime: '09:00',
      priority: 'high',
      subtasks: [
        { id: 1, text: 'Refactor form components', completed: true },
        { id: 2, text: 'Add unit tests', completed: false },
        { id: 3, text: 'Review with team', completed: false },
      ],
      notes: 'Focus on performance optimization',
      timeSpent: 120,
      activity: [],
    },
    {
      id: 3,
      text: 'Learn 3D in CAD',
      description: 'Complete Blender tutorial series on 3D modeling',
      completed: false,
      color: 'blue',
      dueDate: '2024-01-17',
      dueTime: '18:00',
      priority: 'medium',
      subtasks: [
        { id: 1, text: 'Watch modeling basics video', completed: true },
        { id: 2, text: 'Practice mesh manipulation', completed: false },
        { id: 3, text: 'Create simple 3D model', completed: false },
      ],
      notes: 'Use reference images for accuracy',
      timeSpent: 30,
      activity: [],
    },
    {
      id: 4,
      text: 'Meeting with Google Team',
      description: 'Partner integration sync',
      completed: true,
      color: 'green',
      dueDate: '2024-01-14',
      dueTime: '11:00',
      priority: 'medium',
      subtasks: [
        { id: 1, text: 'Prepare demo', completed: true },
        { id: 2, text: 'Test integration', completed: true },
      ],
      notes: 'Successfully integrated analytics API',
      timeSpent: 60,
      activity: [],
    },
  ];
}

// TODO LIST PAGE (Updated with logout)
function TodoListPage({ todos, setTodos, updateTodo, addActivity, userData, onLogout }) {
  const [newTodo, setNewTodo] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        description: '',
        completed: false,
        color: selectedColor,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '09:00',
        priority: 'medium',
        subtasks: [],
        notes: '',
        timeSpent: 0,
        activity: [
          { id: 1, action: 'created', details: '', timestamp: new Date().toISOString() }
        ],
      };
      setTodos([...todos, todo]);
      addActivity(todo.id, 'created', '');
      setNewTodo('');
      setSelectedColor('blue');
    }
  };

  const toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    updateTodo(id, { completed: !todo.completed });
    addActivity(id, todo.completed ? 'reopened' : 'completed', '');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = filter === 'all' ? todos : filter === 'active' ? todos.filter(t => !t.completed) : todos.filter(t => t.completed);
  const getColorObj = (colorName) => colors.find(c => c.name === colorName) || colors[0];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f9ff 100%)', padding: '2rem 1rem' }}>
      {/* Header with User Profile */}
      <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
            {userData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: '#1F2937' }}>{userData?.name || 'User'}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6B7280' }}>Task Manager</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Title */}
      <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#1F2937', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#3B82F6' }}>To</span><span style={{ color: '#F97316' }}>Do</span><span style={{ color: '#10B981' }}>Do</span>
          </h1>
          <div style={{ fontSize: '24px' }}>✓</div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                background: filter === f ? '#3B82F6' : '#E5E7EB',
                color: filter === f ? '#FFFFFF' : '#4B5563',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Todo Section */}
      <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #E5E7EB',
        }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Add a new task
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={addTodo}
              style={{
                padding: '12px 20px',
                background: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}
            >
              <Plus size={18} /> Add
            </button>
          </div>

          {/* Color Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: color.bg,
                  border: selectedColor === color.name ? '3px solid #1F2937' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {filteredTodos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              {filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'All caught up! 🎉' : 'No tasks yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTodos.map(todo => {
              const colorObj = getColorObj(todo.color);
              const completedSubtasks = (todo.subtasks || []).filter(s => s.completed).length;
              const totalSubtasks = (todo.subtasks || []).length;

              return (
                <Link
                  key={todo.id}
                  to={`/todo/${todo.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: colorObj.light,
                      borderLeft: `6px solid ${colorObj.bg}`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${colorObj.bg}33`,
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleComplete(todo.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        color: colorObj.bg,
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>

                    {/* Todo Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: colorObj.text,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        opacity: todo.completed ? 0.6 : 1,
                        marginBottom: '8px',
                      }}>
                        {todo.text}
                      </p>

                      {/* Metadata */}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '12px',
                        color: colorObj.bg,
                        opacity: 0.8,
                        flexWrap: 'wrap',
                      }}>
                        {todo.dueDate && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {todo.priority && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Flag size={14} />
                            {todo.priority === 'high' ? 'High' : todo.priority === 'medium' ? 'Medium' : 'Low'}
                          </span>
                        )}
                        {totalSubtasks > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} />
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo.id);
                        }}
                        style={{
                          padding: '8px 12px',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div style={{
        maxWidth: '700px',
        margin: '3rem auto 0',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '14px',
      }}>
        <p style={{ margin: 0 }}>
          {todos.filter(t => t.completed).length} of {todos.length} tasks completed
        </p>
      </div>
    </div>
  );
}

// TODO DETAIL PAGE (Same as before)
function TodoDetailPage({ todos, updateTodo, addActivity, userData, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const todo = todos.find(t => t.id === parseInt(id));

  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(todo?.text || '');
  const [editDescription, setEditDescription] = useState(todo?.description || '');
  const [editNotes, setEditNotes] = useState(todo?.notes || '');
  const [editDueDate, setEditDueDate] = useState(todo?.dueDate || '');
  const [editDueTime, setEditDueTime] = useState(todo?.dueTime || '09:00');
  const [editPriority, setEditPriority] = useState(todo?.priority || 'medium');
  const [newSubtask, setNewSubtask] = useState('');
  const [timeSpent, setTimeSpent] = useState(todo?.timeSpent || 0);

  if (!todo) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f9ff 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        }}>
          <h2 style={{ color: '#1F2937', marginBottom: '1rem' }}>Task not found</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#3B82F6',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ← Back to List
          </button>
        </div>
      </div>
    );
  }

  const colorObj = colors.find(c => c.name === todo.color) || colors[0];
  const completedSubtasks = (todo.subtasks || []).filter(s => s.completed).length;
  const totalSubtasks = (todo.subtasks || []).length;

  const saveEdits = () => {
    updateTodo(todo.id, {
      text: editText,
      description: editDescription,
      notes: editNotes,
      dueDate: editDueDate,
      dueTime: editDueTime,
      priority: editPriority,
    });
    addActivity(todo.id, 'edited', 'Task details updated');
    setEditMode(false);
  };

  const toggleSubtask = (subtaskId) => {
    const updatedSubtasks = todo.subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    updateTodo(todo.id, { subtasks: updatedSubtasks });
    const subtask = todo.subtasks.find(s => s.id === subtaskId);
    addActivity(todo.id, 'subtask_' + (subtask.completed ? 'uncompleted' : 'completed'), subtask.text);
  };

  const addSubtaskFn = () => {
    if (newSubtask.trim()) {
      const newSubtasks = [...(todo.subtasks || []), {
        id: Date.now(),
        text: newSubtask,
        completed: false,
      }];
      updateTodo(todo.id, { subtasks: newSubtasks });
      addActivity(todo.id, 'subtask_added', newSubtask);
      setNewSubtask('');
    }
  };

  const deleteSubtask = (subtaskId) => {
    const updatedSubtasks = todo.subtasks.filter(s => s.id !== subtaskId);
    updateTodo(todo.id, { subtasks: updatedSubtasks });
  };

  const updateTimeSpent = (newTime) => {
    setTimeSpent(newTime);
    updateTodo(todo.id, { timeSpent: newTime });
    addActivity(todo.id, 'time_logged', `${newTime} minutes logged`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f9ff 100%)',
      padding: '1rem',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#3B82F6',
            textDecoration: 'none',
            fontWeight: '600',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Task Card */}
        <div style={{
          background: colorObj.light,
          borderLeft: `6px solid ${colorObj.bg}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colorObj.bg}33`,
        }}>
          {/* Task Title */}
          {editMode ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                width: '100%',
                fontSize: '24px',
                fontWeight: '700',
                color: colorObj.text,
                border: `2px solid ${colorObj.bg}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: colorObj.text,
                margin: 0,
                flex: 1,
              }}>
                {todo.text}
              </h1>
              <button
                onClick={() => {
                  setEditMode(true);
                  setEditText(todo.text);
                  setEditDescription(todo.description);
                  setEditNotes(todo.notes);
                }}
                style={{
                  padding: '8px 16px',
                  background: '#F3F4F6',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '8px',
                  color: colorObj.text,
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Edit2 size={16} />
                Edit
              </button>
            </div>
          )}

          {/* Status and Priority */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <button
              onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
              style={{
                padding: '8px 16px',
                background: todo.completed ? colorObj.bg : '#F3F4F6',
                color: todo.completed ? '#FFFFFF' : colorObj.text,
                border: `1px solid ${colorObj.bg}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>

            {editMode ? (
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '8px',
                  color: colorObj.text,
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: 'white',
                  fontSize: '14px',
                }}
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label} Priority</option>
                ))}
              </select>
            ) : (
              <span style={{
                padding: '8px 16px',
                background: editPriority === 'high' ? '#FEE2E2' : editPriority === 'medium' ? '#FEF3C7' : '#F0FDF4',
                color: editPriority === 'high' ? '#DC2626' : editPriority === 'medium' ? '#92400E' : '#166534',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Flag size={16} />
                {editPriority === 'high' ? 'High' : editPriority === 'medium' ? 'Medium' : 'Low'} Priority
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: colorObj.text,
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              Description
            </label>
            {editMode ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '8px',
                  color: colorObj.text,
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            ) : (
              <p style={{
                margin: 0,
                padding: '12px',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '8px',
                color: colorObj.text,
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                {todo.description || 'No description added'}
              </p>
            )}
          </div>

          {/* Due Date and Time */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colorObj.text,
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                Due Date
              </label>
              {editMode ? (
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${colorObj.bg}`,
                    borderRadius: '8px',
                    color: colorObj.text,
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              ) : (
                <p style={{
                  margin: 0,
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  color: colorObj.text,
                  fontSize: '14px',
                }}>
                  {editDueDate ? new Date(editDueDate).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: colorObj.text,
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                Time
              </label>
              {editMode ? (
                <input
                  type="time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${colorObj.bg}`,
                    borderRadius: '8px',
                    color: colorObj.text,
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              ) : (
                <p style={{
                  margin: 0,
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  color: colorObj.text,
                  fontSize: '14px',
                }}>
                  {editDueTime}
                </p>
              )}
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          {editMode && (
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <button
                onClick={saveEdits}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colorObj.bg,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#E5E7EB',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1F2937',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={20} style={{ color: colorObj.bg }} />
            Subtasks {totalSubtasks > 0 && <span style={{ fontSize: '14px', color: '#6B7280' }}>({completedSubtasks}/{totalSubtasks})</span>}
          </h2>

          {/* Progress Bar */}
          {totalSubtasks > 0 && (
            <div style={{
              width: '100%',
              height: '8px',
              background: '#E5E7EB',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}>
              <div
                style={{
                  width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                  height: '100%',
                  background: colorObj.bg,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          )}

          {/* Subtask List */}
          <div style={{ marginBottom: '16px' }}>
            {(todo.subtasks || []).map(subtask => (
              <div
                key={subtask.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: colorObj.bg,
                    padding: 0,
                  }}
                >
                  {subtask.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span style={{
                  flex: 1,
                  color: '#374151',
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  opacity: subtask.completed ? 0.6 : 1,
                }}>
                  {subtask.text}
                </span>
                <button
                  onClick={() => deleteSubtask(subtask.id)}
                  style={{
                    background: '#FEE2E2',
                    border: 'none',
                    color: '#DC2626',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask */}
          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSubtaskFn()}
              placeholder="Add a subtask..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              onClick={addSubtaskFn}
              style={{
                padding: '10px 16px',
                background: colorObj.bg,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Notes and Time Tracking */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          {/* Notes */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1F2937',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <FileText size={18} style={{ color: colorObj.bg }} />
              Notes
            </h3>
            {editMode ? (
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px 12px',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            ) : (
              <p style={{
                margin: 0,
                padding: '10px 12px',
                background: '#F9FAFB',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: '1.5',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
              }}>
                {todo.notes || 'No notes added'}
              </p>
            )}
          </div>

          {/* Time Tracking */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1F2937',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Clock size={18} style={{ color: colorObj.bg }} />
              Time Spent
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <input
                type="number"
                value={timeSpent}
                onChange={(e) => updateTimeSpent(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <span style={{
                fontSize: '13px',
                color: '#6B7280',
                minWidth: '50px',
              }}>
                minutes
              </span>
            </div>
            <p style={{
              margin: '12px 0 0 0',
              padding: '10px 12px',
              background: '#F9FAFB',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#6B7280',
            }}>
              {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
            </p>
          </div>
        </div>

        {/* Activity History */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1F2937',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <History size={18} style={{ color: colorObj.bg }} />
            Activity
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {(todo.activity || []).slice().reverse().map((activity, idx) => (
              <div
                key={activity.id}
                style={{
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#6B7280',
                  borderLeft: `3px solid ${colorObj.bg}`,
                }}
              >
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                  {activity.action === 'created' && '✨ Task created'}
                  {activity.action === 'edited' && '✏️ Task edited'}
                  {activity.action === 'completed' && '✅ Marked complete'}
                  {activity.action === 'reopened' && '🔄 Reopened'}
                  {activity.action === 'subtask_completed' && '✓ Subtask completed'}
                  {activity.action === 'subtask_uncompleted' && '○ Subtask uncompleted'}
                  {activity.action === 'subtask_added' && '➕ Subtask added'}
                  {activity.action === 'time_logged' && '⏱️ Time logged'}
                  {activity.details && `: ${activity.details}`}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
            {(!todo.activity || todo.activity.length === 0) && (
              <p style={{ color: '#9CA3AF', textAlign: 'center', margin: '16px 0' }}>
                No activity yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}