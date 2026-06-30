import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, CheckCircle2, Circle, Edit2, Calendar, Flag, Tag, Clock, FileText, History,
  ArrowLeft, Search, Menu, X, Home, FolderOpen, Settings, Repeat, AlertCircle, ChevronRight
} from 'lucide-react';

// Color palette
const colors = [
  { name: 'blue', bg: '#3B82F6', light: '#E0E7FF', text: '#1E40AF' },
  { name: 'yellow', bg: '#FBBF24', light: '#FEF3C7', text: '#92400E' },
  { name: 'orange', bg: '#F97316', light: '#FFEDD5', text: '#9A3412' },
  { name: 'green', bg: '#10B981', light: '#ECFDF5', text: '#065F46' },
  { name: 'purple', bg: '#8B5CF6', light: '#F3E8FF', text: '#5B21B6' },
  { name: 'pink', bg: '#EC4899', light: '#FCE7F3', text: '#831843' },
  { name: 'red', bg: '#EF4444', light: '#FEE2E2', text: '#7F1D1D' },
  { name: 'teal', bg: '#14B8A6', light: '#F0FDFA', text: '#134E4A' },
];

const getDefaultData = () => ({
  workspaces: [
    { id: 1, name: 'Work', icon: '💼', color: 'blue' },
    { id: 2, name: 'Personal', icon: '🎯', color: 'purple' },
    { id: 3, name: 'Shopping', icon: '🛒', color: 'pink' },
  ],
  lists: [
    { id: 1, name: 'Inbox', workspaceId: 1, color: 'blue' },
    { id: 2, name: 'Important', workspaceId: 1, color: 'red' },
    { id: 3, name: 'Health', workspaceId: 2, color: 'green' },
    { id: 4, name: 'Someday', workspaceId: 2, color: 'teal' },
  ],
  todos: [
    {
      id: 1, text: 'Q1 Project Planning', description: 'Plan deliverables for Q1', completed: false,
      workspaceId: 1, listId: 1, color: 'blue', priority: 'high', dueDate: '2024-01-15', dueTime: '14:00',
      tags: ['work', 'planning'], recurring: 'none', estimatedTime: 120, timeSpent: 45,
      subtasks: [{ id: 1, text: 'Collect requirements', completed: true }, { id: 2, text: 'Draft timeline', completed: false }],
      notes: 'Discuss with team leads', activity: []
    },
    {
      id: 2, text: 'Learn React Router', description: 'Master client-side routing', completed: false,
      workspaceId: 1, listId: 1, color: 'orange', priority: 'medium', dueDate: '2024-01-20', dueTime: '18:00',
      tags: ['learning', 'coding'], recurring: 'none', estimatedTime: 240, timeSpent: 120,
      subtasks: [{ id: 1, text: 'Read documentation', completed: true }, { id: 2, text: 'Build practice project', completed: false }],
      notes: '', activity: []
    },
    {
      id: 3, text: 'Morning Workout', description: '30 min cardio', completed: true,
      workspaceId: 2, listId: 3, color: 'green', priority: 'medium', dueDate: '2024-01-14', dueTime: '07:00',
      tags: ['health', 'exercise'], recurring: 'daily', estimatedTime: 30, timeSpent: 32,
      subtasks: [], notes: 'Completed at gym', activity: []
    },
    {
      id: 4, text: 'Buy groceries', description: 'Milk, eggs, vegetables', completed: false,
      workspaceId: 2, listId: 4, color: 'yellow', priority: 'low', dueDate: '2024-01-16', dueTime: '10:00',
      tags: ['shopping'], recurring: 'weekly', estimatedTime: 45, timeSpent: 0,
      subtasks: [], notes: '', activity: []
    },
  ]
});

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('todoData');
    return saved ? JSON.parse(saved) : getDefaultData();
  });

  useEffect(() => {
    localStorage.setItem('todoData', JSON.stringify(data));
  }, [data]);

  const updateTodos = (newTodos) => setData({ ...data, todos: newTodos });
  const updateLists = (newLists) => setData({ ...data, lists: newLists });
  const updateWorkspaces = (newWorkspaces) => setData({ ...data, workspaces: newWorkspaces });

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
        <Sidebar data={data} updateWorkspaces={updateWorkspaces} updateLists={updateLists} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<DashboardPage data={data} />} />
            <Route path="/workspace/:workspaceId" element={<WorkspacePage data={data} updateTodos={updateTodos} />} />
            <Route path="/list/:listId" element={<ListPage data={data} updateTodos={updateTodos} />} />
            <Route path="/todo/:todoId" element={<TodoDetailPage data={data} updateTodos={updateTodos} />} />
            <Route path="/today" element={<TodayPage data={data} updateTodos={updateTodos} />} />
            <Route path="/upcoming" element={<UpcomingPage data={data} updateTodos={updateTodos} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// ============== SIDEBAR NAVIGATION ==============
function Sidebar({ data, updateWorkspaces, updateLists }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{
      width: sidebarOpen ? '280px' : '80px',
      background: '#1F2937',
      color: '#FFFFFF',
      padding: '1.5rem 1rem',
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #374151',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {sidebarOpen && <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>ToDoD<span style={{ color: '#3B82F6' }}>o</span></h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink icon={<Home size={20} />} label="Dashboard" to="/" open={sidebarOpen} />
        <NavLink icon={<Calendar size={20} />} label="Today" to="/today" open={sidebarOpen} />
        <NavLink icon={<AlertCircle size={20} />} label="Upcoming" to="/upcoming" open={sidebarOpen} />

        {sidebarOpen && (
          <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>
              Workspaces
            </div>
            {data.workspaces.map(ws => (
              <Link
                key={ws.id}
                to={`/workspace/${ws.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: '#D1D5DB',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '18px' }}>{ws.icon}</span>
                {ws.name}
              </Link>
            ))}

            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>
              Lists
            </div>
            {data.lists.map(list => (
              <Link
                key={list.id}
                to={`/list/${list.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: '#D1D5DB',
                  textDecoration: 'none',
                  fontSize: '14px',
                  paddingLeft: '28px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FolderOpen size={16} style={{ color: colors.find(c => c.name === list.color)?.bg }} />
                {list.name}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <Link to="/settings" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        color: '#D1D5DB',
        textDecoration: 'none',
        fontSize: '14px',
        marginTop: 'auto',
        transition: 'background 0.2s',
      }}>
        <Settings size={20} />
        {sidebarOpen && 'Settings'}
      </Link>
    </div>
  );
}

function NavLink({ icon, label, to, open }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        color: '#D1D5DB',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {icon}
      {open && label}
    </Link>
  );
}

// ============== PAGES ==============

// DASHBOARD PAGE
function DashboardPage({ data }) {
  const todayTodos = data.todos.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && !t.completed);
  const overdueTodos = data.todos.filter(t => new Date(t.dueDate) < new Date() && !t.completed);
  const completedToday = data.todos.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.completed && t.dueDate === today;
  }).length;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', margin: '0 0 2rem 0' }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        <StatCard icon="📋" label="Total Tasks" value={data.todos.length} color="#3B82F6" />
        <StatCard icon="✅" label="Completed" value={data.todos.filter(t => t.completed).length} color="#10B981" />
        <StatCard icon="📅" label="Today" value={todayTodos.length} color="#F97316" />
        <StatCard icon="⚠️" label="Overdue" value={overdueTodos.length} color="#EF4444" />
      </div>

      {/* Overview Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Today's Tasks */}
        <Section title="Today" icon="📅">
          {todayTodos.length === 0 ? (
            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No tasks for today</p>
          ) : (
            todayTodos.slice(0, 5).map(todo => <TodoItem key={todo.id} todo={todo} data={data} />)
          )}
        </Section>

        {/* Overdue Tasks */}
        <Section title="Overdue" icon="⚠️">
          {overdueTodos.length === 0 ? (
            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>All caught up!</p>
          ) : (
            overdueTodos.slice(0, 5).map(todo => <TodoItem key={todo.id} todo={todo} data={data} />)
          )}
        </Section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: '#FFFFFF',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: '600' }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0 }}>{value}</p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1F2937',
      }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        {title}
      </div>
      <div style={{ padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

// TODAY PAGE
function TodayPage({ data, updateTodos }) {
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const todayTodos = data.todos
    .filter(t => t.dueDate === today)
    .filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()));

  const completed = todayTodos.filter(t => t.completed).length;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', margin: '0 0 1.5rem 0' }}>
        Today · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </h1>

      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#6B7280',
        }}>
          <span>Progress</span>
          <span>{completed} of {todayTodos.length}</span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: '#E5E7EB',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${todayTodos.length ? (completed / todayTodos.length) * 100 : 0}%`,
            height: '100%',
            background: '#3B82F6',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF',
        }} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      {/* Todo List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {todayTodos.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No tasks for today</p>
        ) : (
          todayTodos.map(todo => <TodoItem key={todo.id} todo={todo} data={data} updateTodos={updateTodos} />)
        )}
      </div>
    </div>
  );
}

// UPCOMING PAGE
function UpcomingPage({ data, updateTodos }) {
  const upcomingTodos = data.todos.filter(t => !t.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', margin: '0 0 2rem 0' }}>Upcoming</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {upcomingTodos.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No upcoming tasks</p>
        ) : (
          upcomingTodos.map(todo => <TodoItem key={todo.id} todo={todo} data={data} updateTodos={updateTodos} />)
        )}
      </div>
    </div>
  );
}

// WORKSPACE PAGE
function WorkspacePage({ data, updateTodos }) {
  const { workspaceId } = useParams();
  const workspace = data.workspaces.find(w => w.id === parseInt(workspaceId));
  const workspaceTodos = data.todos.filter(t => t.workspaceId === parseInt(workspaceId));

  if (!workspace) return <div style={{ padding: '2rem' }}>Workspace not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1F2937',
        margin: '0 0 2rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ fontSize: '32px' }}>{workspace.icon}</span>
        {workspace.name}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {workspaceTodos.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No tasks in this workspace</p>
        ) : (
          workspaceTodos.map(todo => <TodoItem key={todo.id} todo={todo} data={data} updateTodos={updateTodos} />)
        )}
      </div>
    </div>
  );
}

// LIST PAGE
function ListPage({ data, updateTodos }) {
  const { listId } = useParams();
  const list = data.lists.find(l => l.id === parseInt(listId));
  const listTodos = data.todos.filter(t => t.listId === parseInt(listId));
  const colorObj = colors.find(c => c.name === list?.color);

  if (!list) return <div style={{ padding: '2rem' }}>List not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: colorObj?.text,
        margin: '0 0 2rem 0',
      }}>
        {list.name}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listTodos.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '2rem' }}>No tasks in this list</p>
        ) : (
          listTodos.map(todo => <TodoItem key={todo.id} todo={todo} data={data} updateTodos={updateTodos} />)
        )}
      </div>
    </div>
  );
}

// TODO ITEM COMPONENT
function TodoItem({ todo, data, updateTodos }) {
  const colorObj = colors.find(c => c.name === todo.color) || colors[0];
  const isOverdue = new Date(todo.dueDate) < new Date() && !todo.completed;

  const toggleComplete = () => {
    const updated = data.todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    updateTodos?.(updated);
  };

  const deleteTodo = (e) => {
    e.preventDefault();
    const updated = data.todos.filter(t => t.id !== todo.id);
    updateTodos?.(updated);
  };

  const recurringLabel = {
    'daily': 'Every day',
    'weekly': 'Every week',
    'monthly': 'Every month',
    'none': ''
  };

  return (
    <Link to={`/todo/${todo.id}`} style={{ textDecoration: 'none' }}>
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: `1px solid ${colorObj.bg}33`,
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleComplete();
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

        {/* Content */}
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
            {isOverdue && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#EF4444',
                fontWeight: '600',
              }}>
                <AlertCircle size={14} />
                Overdue
              </span>
            )}
            {todo.dueDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {todo.priority !== 'low' && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: todo.priority === 'high' ? '#EF4444' : '#F59E0B',
              }}>
                <Flag size={14} />
                {todo.priority}
              </span>
            )}
            {todo.tags?.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={14} />
                {todo.tags[0]}
              </span>
            )}
            {todo.recurring !== 'none' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Repeat size={14} />
                {recurringLabel[todo.recurring]}
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={deleteTodo}
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
            flexShrink: 0,
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Link>
  );
}

// TODO DETAIL PAGE
function TodoDetailPage({ data, updateTodos }) {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const todo = data.todos.find(t => t.id === parseInt(todoId));
  const colorObj = colors.find(c => c.name === todo?.color) || colors[0];

  if (!todo) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#1F2937' }}>Task not found</h2>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#3B82F6',
          color: '#FFFFFF',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          marginTop: '1rem',
        }}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);
  const [editDueTime, setEditDueTime] = useState(todo.dueTime);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editRecurring, setEditRecurring] = useState(todo.recurring);
  const [editTimeSpent, setEditTimeSpent] = useState(todo.timeSpent);
  const [newSubtask, setNewSubtask] = useState('');

  const saveEdits = () => {
    const updated = data.todos.map(t =>
      t.id === todo.id ? {
        ...t,
        text: editText,
        description: editDescription,
        dueDate: editDueDate,
        dueTime: editDueTime,
        priority: editPriority,
        recurring: editRecurring,
        timeSpent: editTimeSpent,
      } : t
    );
    updateTodos(updated);
    setEditMode(false);
  };

  const toggleComplete = () => {
    const updated = data.todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    updateTodos(updated);
  };

  const toggleSubtask = (subtaskId) => {
    const updated = data.todos.map(t =>
      t.id === todo.id ? {
        ...t,
        subtasks: t.subtasks.map(s =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        )
      } : t
    );
    updateTodos(updated);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const updated = data.todos.map(t =>
        t.id === todo.id ? {
          ...t,
          subtasks: [...t.subtasks, { id: Date.now(), text: newSubtask, completed: false }]
        } : t
      );
      updateTodos(updated);
      setNewSubtask('');
    }
  };

  const completedSubtasks = todo.subtasks.filter(s => s.completed).length;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#3B82F6',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '1.5rem',
          fontSize: '14px',
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Main Task Card */}
      <div style={{
        background: colorObj.light,
        borderLeft: `6px solid ${colorObj.bg}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: `1px solid ${colorObj.bg}33`,
      }}>
        {/* Title */}
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
            justifyContent: 'space-between',
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

        {/* Status & Priority */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={toggleComplete}
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
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          ) : (
            <span style={{
              padding: '8px 16px',
              background: todo.priority === 'high' ? '#FEE2E2' : todo.priority === 'medium' ? '#FEF3C7' : '#F0FDF4',
              color: todo.priority === 'high' ? '#DC2626' : todo.priority === 'medium' ? '#92400E' : '#166534',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Flag size={16} />
              {todo.priority === 'high' ? 'High' : todo.priority === 'medium' ? 'Medium' : 'Low'} Priority
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

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <DetailField label="Due Date" value={editDueDate} onChange={setEditDueDate} type="date" editable={editMode} />
          <DetailField label="Time" value={editDueTime} onChange={setEditDueTime} type="time" editable={editMode} />
          <DetailField
            label="Recurring"
            value={editRecurring}
            onChange={setEditRecurring}
            type="select"
            options={{ 'none': 'None', 'daily': 'Daily', 'weekly': 'Weekly', 'monthly': 'Monthly' }}
            editable={editMode}
          />
        </div>

        {/* Save/Cancel Buttons */}
        {editMode && (
          <div style={{
            display: 'flex',
            gap: '12px',
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

      {/* Subtasks */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
          Subtasks {todo.subtasks?.length > 0 && <span style={{ fontSize: '14px', color: '#6B7280' }}>({completedSubtasks}/{todo.subtasks.length})</span>}
        </h2>

        {/* Progress Bar */}
        {todo.subtasks?.length > 0 && (
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
                width: `${(completedSubtasks / todo.subtasks.length) * 100}%`,
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
            onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
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
            onClick={addSubtask}
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

      {/* Time Tracking */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
          <Clock size={18} style={{ color: colorObj.bg }} />
          Time Tracking
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Estimated</label>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colorObj.text }}>{Math.floor(todo.estimatedTime / 60)}h {todo.estimatedTime % 60}m</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Time Spent</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={editTimeSpent}
                onChange={(e) => setEditTimeSpent(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: `1px solid ${colorObj.bg}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '12px', color: '#6B7280' }}>min</span>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>Remaining</label>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colorObj.text }}>
              {Math.floor((todo.estimatedTime - editTimeSpent) / 60)}h {(todo.estimatedTime - editTimeSpent) % 60}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, onChange, type, options, editable }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {editable && type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            color: '#374151',
            fontFamily: 'inherit',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {Object.entries(options).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
      ) : editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            color: '#374151',
            fontFamily: 'inherit',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      ) : (
        <p style={{
          margin: 0,
          padding: '10px 12px',
          background: '#F9FAFB',
          borderRadius: '8px',
          color: '#374151',
          fontSize: '14px',
        }}>
          {type === 'date' ? (value ? new Date(value).toLocaleDateString() : 'Not set') : value || 'Not set'}
        </p>
      )}
    </div>
  );
}
