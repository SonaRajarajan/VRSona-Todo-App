import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TodoDetailPage from './pages/TodoDetailPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Login/Onboarding Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <DashboardPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/todo/:id"
          element={isLoggedIn ? <TodoDetailPage /> : <Navigate to="/" replace />}
        />

        {/* Catch all - redirect to home if logged in, login if not */}
        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
