import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdminLoggedIn');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password) => {
    // Default admin password - change this in production!
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

