import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      return;
    }

    const userData = { name: name.trim(), age };

    // This is the missing piece: tell App.js the user is logged in.
    // App.js sets isLoggedIn=true and user=userData, and persists both
    // to localStorage via its own useEffect hooks.
    if (onLogin) {
      onLogin(userData);
    }

    // Send them to the dashboard. Since isLoggedIn is now true,
    // ProtectedRoute will let them through instead of bouncing back to "/".
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          {/* Left Side - Illustration/Branding */}
          <div className="login-left">
            <div className="brand-section">
              <div className="app-icon">
                <span>✓</span>
              </div>
              <h1 className="brand-title">
                <span className="to">To</span>
                <span className="do">Do</span>
                <span className="do2">Do</span>
              </h1>
              <p className="brand-subtitle">Your Personal Task Manager</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <div className="feature-text">
                  <h3>Organize Tasks</h3>
                  <p>Keep all your tasks in one place</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h3>Set Priorities</h3>
                  <p>Focus on what matters most</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-text">
                  <h3>Track Progress</h3>
                  <p>Monitor your productivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="login-right">
            <div className="form-container">
              <h2>Welcome to ToDoDo</h2>
              <p className="form-subtitle">Let's get you started</p>

              <form onSubmit={handleGetStarted} className="login-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (errors.age) {
                        setErrors({ ...errors, age: '' });
                      }
                    }}
                    className={errors.age ? 'error' : ''}
                    min="13"
                    max="120"
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>

                <button type="submit" className="get-started-btn">
                  Get Started
                  <span className="btn-arrow">→</span>
                </button>
              </form>

              <p className="form-footer">
                You're all set to manage your tasks like a pro!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;