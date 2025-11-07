import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple delay to show loading state
    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-login-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🔐 Admin Login</h1>
            <p>Staff Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading || !password}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>  <strong> </strong></p>
            <p className="note"> </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

