import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { createSocket } from '../utils/socket';
import './Navbar.css';
import logo from '../Assets/logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const lastKnownStatusRef = useRef({});

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Load persisted unread count
  useEffect(() => {
    if (!isAdmin) return;
    const stored = localStorage.getItem('adminUnreadOrders');
    if (stored) {
      const n = parseInt(stored, 10);
      if (!isNaN(n)) setNewOrderCount(n);
    }
  }, [isAdmin]);

  // Persist unread count whenever it changes
  useEffect(() => {
    if (!isAdmin) return;
    localStorage.setItem('adminUnreadOrders', String(newOrderCount));
  }, [isAdmin, newOrderCount]);

  // Admin notifications via Socket.io for new orders and key status changes
  useEffect(() => {
    if (!isAdmin) return;
    const socket = createSocket();
    socket.on('new-order', () => {
      setNewOrderCount((count) => count + 1);
    });

    socket.on('order-updated', (updatedOrder) => {
      const status = updatedOrder?.status;
      const id = updatedOrder?.id;
      if (!id) return;
      const prev = lastKnownStatusRef.current[id];
      lastKnownStatusRef.current[id] = status;
      // Notify when an order transitions into confirmed or ready
      if ((status === 'confirmed' || status === 'ready') && prev !== status) {
        setNewOrderCount((count) => count + 1);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  // Note: counter resets only when clicking the Admin link explicitly

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt={t('app.title')} className="logo-img" />
          <span className="logo-text">{t('app.title')}</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/menus"
            className={`navbar-link ${isActive('/menus') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.menus')}
          </Link>
          <Link
            to="/orders"
            className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.orders')}
          </Link>
          <Link
            to="/padel"
            className={`navbar-link ${isActive('/padel') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.padel')}
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => { setMobileMenuOpen(false); setNewOrderCount(0); }}
              >
                {t('nav.admin')}
                {newOrderCount > 0 && (
                  <span className="admin-badge">{newOrderCount}</span>
                )}
              </Link>
              <Link
                to="/admin/import"
                className={`navbar-link ${isActive('/admin/import') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Import Menus
              </Link>
            </>
          )}
          {!isAdmin && (
            <Link
              to="/admin/login"
              className={`navbar-link ${isActive('/admin/login') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Staff Login
            </Link>
          )}

          <div className="language-selector">
            <button
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}
              onClick={() => changeLanguage('ar')}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

