import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const ProgressAnalyticsDashboard = ({ tasks = generateMockTasks() }) => {
  const [timeRange, setTimeRange] = useState('month');

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Weekly stats
    const weeklyData = generateWeeklyStats(tasks);
    const monthlyData = generateMonthlyStats(tasks);
    const dailyStats = generateDailyStats(tasks);

    // Streak calculation
    const streak = calculateProductivityStreak(tasks);

    // Completion trend
    const completionTrend = calculateTrend(completedTasks, tasks);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      weeklyData,
      monthlyData,
      dailyStats,
      streak,
      completionTrend,
    };
  }, [tasks, timeRange]);

  const getTimelineData = () => {
    switch (timeRange) {
      case 'week':
        return analytics.weeklyData;
      case 'month':
        return analytics.monthlyData;
      case 'all':
        return analytics.dailyStats.slice(-30);
      default:
        return analytics.monthlyData;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Progress Analytics</h1>
          <p className="text-slate-400">Track your productivity and task completion insights</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range === 'all' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            label="Total Tasks"
            value={analytics.totalTasks}
            icon={<Target className="w-6 h-6" />}
            bgColor="from-blue-600 to-blue-700"
            trend={null}
          />
          <MetricCard
            label="Completed"
            value={analytics.completedTasks}
            icon={<CheckCircle2 className="w-6 h-6" />}
            bgColor="from-green-600 to-green-700"
            trend={analytics.completionTrend}
          />
          <MetricCard
            label="Pending"
            value={analytics.pendingTasks}
            icon={<Clock className="w-6 h-6" />}
            bgColor="from-orange-600 to-orange-700"
            trend={null}
          />
          <MetricCard
            label="Completion Rate"
            value={`${analytics.completionPercentage.toFixed(1)}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            bgColor="from-purple-600 to-purple-700"
            trend={null}
          />
          <MetricCard
            label="Current Streak"
            value={analytics.streak.current}
            icon={<Zap className="w-6 h-6" />}
            bgColor="from-yellow-600 to-yellow-700"
            trend={null}
            subtext={`Best: ${analytics.streak.best}`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Completion Chart */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Completion Timeline
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {timeRange === 'week'
                  ? 'Last 7 days'
                  : timeRange === 'month'
                  ? 'Last 30 days'
                  : 'All time'}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getTimelineData()}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  name="Completed Tasks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Pie Chart */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-400" />
              Task Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Completed',
                      value: analytics.completedTasks,
                    },
                    {
                      name: 'Pending',
                      value: analytics.pendingTasks,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly vs Monthly Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Breakdown */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-400" />
              Weekly Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="created" fill="#3b82f6" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Monthly Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                  name="Total Tasks"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Streak */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            Productivity Streak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StreakCard
              label="Current Streak"
              value={analytics.streak.current}
              subtext="consecutive days"
              trend="up"
              icon={<Zap className="w-8 h-8" />}
            />
            <StreakCard
              label="Best Streak"
              value={analytics.streak.best}
              subtext="days"
              trend="neutral"
              icon={<Award className="w-8 h-8" />}
            />
            <StreakCard
              label="Avg Daily Tasks"
              value={analytics.streak.averageDailyTasks.toFixed(1)}
              subtext="tasks per day"
              trend={analytics.streak.averageDailyTasks > 2 ? 'up' : 'down'}
              icon={<Target className="w-8 h-8" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= Helper Components =============

const MetricCard = ({ label, value, icon, bgColor, trend, subtext }) => (
  <div
    className={`bg-gradient-to-br ${bgColor} rounded-xl p-6 shadow-lg border border-opacity-20 border-white transform transition-transform hover:scale-105`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="text-white opacity-90">{icon}</div>
      {trend !== null && trend !== undefined && (
        <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
          {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="text-sm">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div className="text-white opacity-80 text-sm font-medium mb-2">{label}</div>
    <div className="text-4xl font-bold text-white mb-1">{value}</div>
    {subtext && <div className="text-white opacity-70 text-xs">{subtext}</div>}
  </div>
);

const StreakCard = ({ label, value, subtext, trend, icon }) => (
  <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
    <div
      className={`inline-block p-3 rounded-lg mb-4 ${
        trend === 'up'
          ? 'bg-green-500/20'
          : trend === 'down'
          ? 'bg-red-500/20'
          : 'bg-blue-500/20'
      }`}
    >
      <div
        className={
          trend === 'up'
            ? 'text-green-400'
            : trend === 'down'
            ? 'text-red-400'
            : 'text-blue-400'
        }
      >
        {icon}
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-slate-500 text-xs">{subtext}</p>
  </div>
);

// ============= Utility Functions =============

function generateMockTasks() {
  const tasks = [];
  const baseDate = new Date();

  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const completed = Math.random() > 0.3;
    const completedAt = completed
      ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      : undefined;

    tasks.push({
      id: `task-${i}`,
      title: `Task ${i + 1}`,
      completed,
      createdAt,
      completedAt,
    });
  }

  return tasks;
}

function generateWeeklyStats(tasks) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    const completed = dayTasks.filter((t) => t.completed).length;
    const created = dayTasks.length;

    data.push({
      name: days[date.getDay()],
      created,
      completed,
    });
  }

  return data;
}

function generateMonthlyStats(tasks) {
  const data = [];
  const now = new Date();

  for (let week = 3; week >= 0; week--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - week * 7);

    const weekTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      const daysDiff = Math.floor(
        (taskDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff >= 0 && daysDiff < 7;
    });

    const completed = weekTasks.filter((t) => t.completed).length;

    data.push({
      week: `Week ${4 - week}`,
      tasks: weekTasks.length,
      completed,
    });
  }

  return data;
}

function generateDailyStats(tasks) {
  const data = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    const completed = dayTasks.filter((t) => t.completed).length;

    data.push({
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      completed,
      created: dayTasks.length,
    });
  }

  return data;
}

function calculateProductivityStreak(tasks) {
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const now = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    const hasCompletion = dayTasks.some((t) => t.completed && t.completedAt);

    if (hasCompletion) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      tempStreak = 0;
    }
  }

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const averageDailyTasks = tasks.length > 0 ? tasks.length / 90 : 0;

  return {
    current: currentStreak,
    best: Math.max(bestStreak, currentStreak),
    averageDailyTasks,
  };
}

function calculateTrend(completedTasks, tasks) {
  if (tasks.length < 2) return 0;

  const now = new Date();
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(lastWeekStart.getDate() - 14);

  const firstWeekTasks = tasks.filter((t) => {
    const taskDate = new Date(t.createdAt);
    return taskDate < lastWeekStart && t.completed;
  }).length;

  const secondWeekTasks = tasks.filter((t) => {
    const taskDate = new Date(t.createdAt);
    return taskDate >= lastWeekStart && t.completed;
  }).length;

  if (firstWeekTasks === 0) return 0;
  return ((secondWeekTasks - firstWeekTasks) / firstWeekTasks) * 100;
}

function renderLabel(entry) {
  return `${entry.name}: ${entry.value}`;
}

export default ProgressAnalyticsDashboard;