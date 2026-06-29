import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, CheckCircle2, Circle, Edit2, Clock,
  FileText, History, ArrowLeft, Calendar, Flag, AlertTriangle, Bell,
} from 'lucide-react';
import LoginPage from './LoginPage';

// ─── Constants ────────────────────────────────────────────────────────────────

const colors = [
  { name: 'blue',   bg: '#3B82F6', light: '#E0E7FF', text: '#1E40AF' },
  { name: 'yellow', bg: '#FBBF24', light: '#FEF3C7', text: '#92400E' },
  { name: 'orange', bg: '#F97316', light: '#FFEDD5', text: '#9A3412' },
  { name: 'green',  bg: '#10B981', light: '#ECFDF5', text: '#065F46' },
  { name: 'purple', bg: '#8B5CF6', light: '#F3E8FF', text: '#5B21B6' },
  { name: 'pink',   bg: '#EC4899', light: '#FCE7F3', text: '#831843' },
  { name: 'red',    bg: '#EF4444', light: '#FEE2E2', text: '#7F1D1D' },
  { name: 'teal',   bg: '#14B8A6', light: '#F0FDFA', text: '#134E4A' },
];

const priorities = [
  { value: 'low',    label: 'Low',    color: '#6B7280' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high',   label: 'High',   color: '#EF4444' },
];

const getColor = (name) => colors.find(c => c.name === name) || colors[0];

// ─── Default Data ─────────────────────────────────────────────────────────────

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

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : getDefaultTodos();
    } catch {
      return getDefaultTodos();
    }
  });

  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dismissedAlerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    sessionStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
  }, [dismissedAlerts]);

  const dismissAlert = (todoId) =>
    setDismissedAlerts(prev => [...prev, todoId]);

  const updateTodo = (id, updates) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    if (updates.completed === false)
      setDismissedAlerts(prev => prev.filter(d => d !== id));
  };

  const addActivity = (todoId, action, details = '') => {
    setTodos(prev =>
      prev.map(t =>
        t.id !== todoId
          ? t
          : {
              ...t,
              activity: [
                ...(t.activity || []),
                { id: Date.now(), action, details, timestamp: new Date().toISOString() },
              ],
            }
      )
    );
  };

  const toggleComplete = (id) => {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const nowCompleted = !t.completed;
        if (nowCompleted) setDismissedAlerts(d => [...d, id]);
        else setDismissedAlerts(d => d.filter(x => x !== id));
        return {
          ...t,
          completed: nowCompleted,
          activity: [
            ...(t.activity || []),
            {
              id: Date.now(),
              action: nowCompleted ? 'completed' : 'reopened',
              details: '',
              timestamp: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/todos"
          element={
            <TodoListPage
              todos={todos}
              setTodos={setTodos}
              updateTodo={updateTodo}
              addActivity={addActivity}
              toggleComplete={toggleComplete}
              dismissedAlerts={dismissedAlerts}
              dismissAlert={dismissAlert}
            />
          }
        />
        <Route
          path="/todo/:id"
          element={
            <TodoDetailPage
              todos={todos}
              updateTodo={updateTodo}
              addActivity={addActivity}
              toggleComplete={toggleComplete}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// ─── Todo List Page ───────────────────────────────────────────────────────────

function TodoListPage({
  todos, setTodos, updateTodo, addActivity,
  toggleComplete, dismissedAlerts, dismissAlert,
}) {
  const navigate = useNavigate();
  const [newTodo, setNewTodo]           = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [filter, setFilter]             = useState('all');

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

  const filteredTodos =
    filter === 'active'    ? todos.filter(t => !t.completed) :
    filter === 'completed' ? todos.filter(t =>  t.completed) :
    todos;

  return (
    <div style={{ minHeight: '100vh', background: '#4F46E5', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#3B82F6' }}>To</span>
            <span style={{ color: '#F97316' }}>Do</span>
            <span style={{ color: '#10B981' }}>Do</span>
          </h1>
          {overdueTodos.length > 0 && (
            <div style={{
              background: '#EF4444', color: '#fff', padding: '6px 16px',
              borderRadius: '9999px', fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px',
            }}>
              <AlertTriangle size={16} /> {overdueTodos.length} Overdue
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{
            width: '300px', flexShrink: 0, background: '#fff', borderRadius: '16px',
            padding: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            position: 'sticky', top: '20px',
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#EF4444" /> Priority Tasks
            </h3>

            {/* Overdue */}
            {overdueTodos.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '700', color: '#991B1B', marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Overdue ({overdueTodos.length})
                </div>
                {overdueTodos.map(todo => (
                  <div
                    key={todo.id}
                    style={{
                      padding: '12px 14px', background: '#FEF2F2',
                      borderLeft: '4px solid #EF4444', borderRadius: '8px',
                      marginBottom: '8px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    }}
                  >
                    <div onClick={() => navigate(`/todo/${todo.id}`)} style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>{todo.text}</div>
                      <div style={{ fontSize: '12px', color: '#B91C1C' }}>
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(todo.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0 0 0 8px', fontSize: '16px', lineHeight: 1 }}
                      title="Dismiss"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Due Soon */}
            {dueSoonTodos.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: '700', color: '#92400E', marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Due Soon ({dueSoonTodos.length})
                </div>
                {dueSoonTodos.map(todo => (
                  <div
                    key={todo.id}
                    style={{
                      padding: '12px 14px', background: '#FFFBEB',
                      borderLeft: '4px solid #F59E0B', borderRadius: '8px',
                      marginBottom: '8px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    }}
                  >
                    <div onClick={() => navigate(`/todo/${todo.id}`)} style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>{todo.text}</div>
                      <div style={{ fontSize: '12px', color: '#B45309' }}>
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(todo.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0 0 0 8px', fontSize: '16px', lineHeight: 1 }}
                      title="Dismiss"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* All clear */}
            {overdueTodos.length === 0 && dueSoonTodos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#10B981' }}>
                <CheckCircle2 size={48} />
                <p style={{ marginTop: '12px', color: '#374151', fontSize: '14px' }}>All tasks are on track!</p>
              </div>
            )}

            {/* Stats */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                <span>Total tasks</span><span style={{ fontWeight: '700', color: '#1F2937' }}>{todos.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                <span>Completed</span><span style={{ fontWeight: '700', color: '#10B981' }}>{todos.filter(t => t.completed).length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' }}>
                <span>Active</span><span style={{ fontWeight: '700', color: '#3B82F6' }}>{todos.filter(t => !t.completed).length}</span>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 20px', border: 'none', borderRadius: '8px',
                    background: filter === f ? '#3B82F6' : 'rgba(255,255,255,0.2)',
                    color: filter === f ? '#fff' : '#E0E7FF',
                    fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Add Todo */}
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)', marginBottom: '1.5rem',
              border: '1px solid #E5E7EB',
            }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Add a new task
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={e => setNewTodo(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addTodo()}
                  placeholder="What needs to be done?"
                  style={{
                    flex: 1, padding: '12px 16px', border: '1px solid #E5E7EB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={addTodo}
                  style={{
                    padding: '12px 20px', background: '#3B82F6', color: '#fff',
                    border: 'none', borderRadius: '8px', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '14px',
                  }}
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              {/* Color Picker */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: c.bg,
                      border: selectedColor === c.name ? '3px solid #1F2937' : '2px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Todo List */}
            {filteredTodos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#E0E7FF' }}>
                <p style={{ fontSize: '16px' }}>
                  {filter === 'completed' ? 'No completed tasks yet' :
                   filter === 'active'    ? 'All caught up! 🎉' :
                   'No tasks yet. Add one above!'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTodos.map(todo => {
                  const col          = getColor(todo.color);
                  const completedSub = (todo.subtasks || []).filter(s => s.completed).length;
                  const totalSub     = (todo.subtasks || []).length;

                  return (
                    <div
                      key={todo.id}
                      onClick={() => navigate(`/todo/${todo.id}`)}
                      style={{
                        background: col.light,
                        borderLeft: `6px solid ${col.bg}`,
                        border: `1px solid ${col.bg}33`,
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleComplete(todo.id); }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', padding: '2px',
                          color: col.bg, flexShrink: 0, marginTop: '1px',
                          outline: 'none', borderRadius: '50%',
                        }}
                        title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {todo.completed
                          ? <CheckCircle2 size={24} fill={col.bg} color="#fff" />
                          : <Circle size={24} />}
                      </button>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: col.text,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          opacity: todo.completed ? 0.55 : 1,
                        }}>
                          {todo.text}
                        </p>
                        {todo.description ? (
                          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: col.text, opacity: 0.7 }}>
                            {todo.description}
                          </p>
                        ) : null}
                        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: col.bg, opacity: 0.85, flexWrap: 'wrap', alignItems: 'center' }}>
                          {todo.dueDate && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} />
                              {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                          {todo.priority && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Flag size={12} />
                              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            </span>
                          )}
                          {totalSub > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> {completedSub}/{totalSub}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={e => { e.stopPropagation(); deleteTodo(todo.id); }}
                        style={{
                          padding: '8px 10px', background: '#FEE2E2', color: '#DC2626',
                          border: '1px solid #FECACA', borderRadius: '6px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0,
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer count */}
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#C7D2FE', fontSize: '14px' }}>
              {todos.filter(t => t.completed).length} of {todos.length} tasks completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Todo Detail Page ─────────────────────────────────────────────────────────

function TodoDetailPage({ todos, updateTodo, addActivity, toggleComplete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const todo = todos.find(t => t.id === parseInt(id));

  const [editMode,          setEditMode]          = useState(false);
  const [editText,          setEditText]          = useState('');
  const [editDescription,   setEditDescription]   = useState('');
  const [editNotes,         setEditNotes]         = useState('');
  const [editDueDate,       setEditDueDate]       = useState('');
  const [editDueTime,       setEditDueTime]       = useState('09:00');
  const [editPriority,      setEditPriority]      = useState('medium');
  const [newSubtask,        setNewSubtask]        = useState('');
  const [timeSpent,         setTimeSpent]         = useState(0);

  useEffect(() => {
    if (todo) {
      setEditText(todo.text);
      setEditDescription(todo.description || '');
      setEditNotes(todo.notes || '');
      setEditDueDate(todo.dueDate || '');
      setEditDueTime(todo.dueTime || '09:00');
      setEditPriority(todo.priority || 'medium');
      setTimeSpent(todo.timeSpent || 0);
    }
  }, [todo]);

  if (!todo) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1F2937', marginBottom: '1rem' }}>Task not found</h2>
          <button
            onClick={() => navigate('/todos')}
            style={{ padding: '12px 24px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back to List
          </button>
        </div>
      </div>
    );
  }

  const col          = getColor(todo.color);
  const completedSub = (todo.subtasks || []).filter(s => s.completed).length;
  const totalSub     = (todo.subtasks || []).length;

  const saveEdits = () => {
    updateTodo(todo.id, {
      text: editText, description: editDescription, notes: editNotes,
      dueDate: editDueDate, dueTime: editDueTime, priority: editPriority,
    });
    addActivity(todo.id, 'edited', 'Task details updated');
    setEditMode(false);
  };

  const toggleSubtask = (subtaskId) => {
    const sub = todo.subtasks.find(s => s.id === subtaskId);
    const updated = todo.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    updateTodo(todo.id, { subtasks: updated });
    addActivity(todo.id, sub.completed ? 'subtask_uncompleted' : 'subtask_completed', sub.text);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const updated = [...(todo.subtasks || []), { id: Date.now(), text: newSubtask.trim(), completed: false }];
    updateTodo(todo.id, { subtasks: updated });
    addActivity(todo.id, 'subtask_added', newSubtask);
    setNewSubtask('');
  };

  const deleteSubtask = (subtaskId) => {
    updateTodo(todo.id, { subtasks: todo.subtasks.filter(s => s.id !== subtaskId) });
  };

  const handleTimeSpent = (val) => {
    const n = Math.max(0, parseInt(val) || 0);
    setTimeSpent(n);
    updateTodo(todo.id, { timeSpent: n });
    addActivity(todo.id, 'time_logged', `${n} minutes logged`);
  };

  const priorityStyle = (p) =>
    p === 'high'   ? { background: '#FEE2E2', color: '#DC2626' } :
    p === 'medium' ? { background: '#FEF3C7', color: '#92400E' } :
                     { background: '#F0FDF4', color: '#166534' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f8f7ff,#f0f9ff)', padding: '1rem' }}>

      {/* Back */}
      <div style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
        <button
          onClick={() => navigate('/todos')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3B82F6',
            background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer',
            fontSize: '15px', padding: '8px 12px', borderRadius: '8px',
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* ── Task Card ── */}
        <div style={{
          background: col.light, borderLeft: `6px solid ${col.bg}`,
          border: `1px solid ${col.bg}33`, borderRadius: '16px',
          padding: '24px', marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {/* Title */}
          {editMode ? (
            <input
              type="text" value={editText} onChange={e => setEditText(e.target.value)}
              style={{
                width: '100%', fontSize: '24px', fontWeight: '700', color: col.text,
                border: `2px solid ${col.bg}`, borderRadius: '8px', padding: '12px',
                marginBottom: '16px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: col.text, margin: 0, flex: 1 }}>{todo.text}</h1>
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: '8px 16px', background: '#F3F4F6', border: `1px solid ${col.bg}`,
                  borderRadius: '8px', color: col.text, cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <Edit2 size={16} /> Edit
              </button>
            </div>
          )}

          {/* Status + Priority */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => toggleComplete(todo.id)}
              style={{
                padding: '8px 16px',
                background: todo.completed ? col.bg : '#F3F4F6',
                color: todo.completed ? '#fff' : col.text,
                border: `1px solid ${col.bg}`, borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>

            {editMode ? (
              <select
                value={editPriority} onChange={e => setEditPriority(e.target.value)}
                style={{
                  padding: '8px 12px', border: `1px solid ${col.bg}`, borderRadius: '8px',
                  color: col.text, fontWeight: '600', cursor: 'pointer', background: 'white', fontSize: '14px',
                }}
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label} Priority</option>
                ))}
              </select>
            ) : (
              <span style={{
                padding: '8px 16px', borderRadius: '8px',
                fontWeight: '600', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '6px',
                ...priorityStyle(todo.priority),
              }}>
                <Flag size={16} />
                {(todo.priority || 'medium').charAt(0).toUpperCase() + (todo.priority || 'medium').slice(1)} Priority
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: col.text, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Description
            </label>
            {editMode ? (
              <textarea
                value={editDescription} onChange={e => setEditDescription(e.target.value)}
                style={{
                  width: '100%', minHeight: '80px', padding: '12px',
                  border: `1px solid ${col.bg}`, borderRadius: '8px', color: col.text,
                  fontFamily: 'inherit', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
            ) : (
              <p style={{
                margin: 0, padding: '12px', background: 'rgba(255,255,255,0.5)',
                borderRadius: '8px', color: col.text, fontSize: '14px', lineHeight: '1.6',
              }}>
                {todo.description || 'No description added'}
              </p>
            )}
          </div>

          {/* Due Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: col.text, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</label>
              {editMode ? (
                <input
                  type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: `1px solid ${col.bg}`, borderRadius: '8px', color: col.text, fontFamily: 'inherit', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              ) : (
                <p style={{ margin: 0, padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', color: col.text, fontSize: '14px' }}>
                  {editDueDate ? new Date(editDueDate).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: col.text, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</label>
              {editMode ? (
                <input
                  type="time" value={editDueTime} onChange={e => setEditDueTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: `1px solid ${col.bg}`, borderRadius: '8px', color: col.text, fontFamily: 'inherit', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              ) : (
                <p style={{ margin: 0, padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', color: col.text, fontSize: '14px' }}>{editDueTime}</p>
              )}
            </div>
          </div>

          {/* Save / Cancel */}
          {editMode && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={saveEdits} style={{ flex: 1, padding: '12px', background: col.bg, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                Save Changes
              </button>
              <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: '12px', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Subtasks ── */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color={col.bg} />
            Subtasks {totalSub > 0 && <span style={{ fontSize: '14px', color: '#6B7280' }}>({completedSub}/{totalSub})</span>}
          </h2>

          {totalSub > 0 && (
            <div style={{ width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${(completedSub / totalSub) * 100}%`, height: '100%', background: col.bg, transition: 'width 0.3s' }} />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            {(todo.subtasks || []).map(sub => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '8px' }}>
                <button onClick={() => toggleSubtask(sub.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: col.bg, padding: 0, flexShrink: 0 }}>
                  {sub.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span style={{ flex: 1, color: '#374151', fontSize: '14px', textDecoration: sub.completed ? 'line-through' : 'none', opacity: sub.completed ? 0.6 : 1 }}>
                  {sub.text}
                </span>
                <button onClick={() => deleteSubtask(sub.id)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text" value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addSubtask()}
              placeholder="Add a subtask..."
              style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            />
            <button onClick={addSubtask} style={{ padding: '10px 16px', background: col.bg, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* ── Notes + Time Spent ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Notes */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color={col.bg} /> Notes
            </h3>
            {editMode ? (
              <textarea
                value={editNotes} onChange={e => setEditNotes(e.target.value)}
                style={{ width: '100%', minHeight: '100px', padding: '10px 12px', border: `1px solid ${col.bg}`, borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            ) : (
              <p style={{ margin: 0, padding: '10px 12px', background: '#F9FAFB', borderRadius: '8px', fontSize: '13px', color: '#6B7280', lineHeight: '1.5', minHeight: '80px' }}>
                {todo.notes || 'No notes added'}
              </p>
            )}
          </div>

          {/* Time Spent */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color={col.bg} /> Time Spent
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <input
                type="number" value={timeSpent} min="0"
                onChange={e => handleTimeSpent(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', border: `1px solid ${col.bg}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
              />
              <span style={{ fontSize: '13px', color: '#6B7280' }}>min</span>
            </div>
            <p style={{ margin: 0, padding: '10px 12px', background: '#F9FAFB', borderRadius: '8px', fontSize: '13px', color: '#6B7280' }}>
              {Math.floor(timeSpent / 60)}h {timeSpent % 60}m total
            </p>
          </div>
        </div>

        {/* ── Activity Log ── */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color={col.bg} /> Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(todo.activity || []).length === 0 ? (
              <p style={{ color: '#9CA3AF', textAlign: 'center', margin: '16px 0', fontSize: '14px' }}>No activity yet</p>
            ) : (
              [...(todo.activity || [])].reverse().map(a => (
                <div key={a.id} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', fontSize: '13px', borderLeft: `3px solid ${col.bg}` }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                    {a.action === 'created'              && '✨ Task created'}
                    {a.action === 'edited'               && '✏️ Task edited'}
                    {a.action === 'completed'            && '✅ Marked complete'}
                    {a.action === 'reopened'             && '🔄 Reopened'}
                    {a.action === 'subtask_completed'    && '✓ Subtask completed'}
                    {a.action === 'subtask_uncompleted'  && '○ Subtask uncompleted'}
                    {a.action === 'subtask_added'        && '➕ Subtask added'}
                    {a.action === 'time_logged'          && '⏱️ Time logged'}
                    {a.details ? `: ${a.details}` : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {new Date(a.timestamp).toLocaleString()}
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