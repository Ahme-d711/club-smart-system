import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { createSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('recent'); // recent | venue-asc | venue-desc
  const [venueFilter, setVenueFilter] = useState('all');

  useEffect(() => {
    fetchOrders();

    // Connect to Socket.io for real-time updates
    const socket = createSocket();
    
    socket.on('new-order', (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on('order-updated', (updatedOrder) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    socket.on('order-deleted', (orderId) => {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      const byRecent = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(byRecent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(t('common.error') + ': ' + (error.response?.data?.error || error.message));
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await api.delete(`/api/orders/${orderId}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(t('common.error') + ': ' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#9c27b0',
      ready: '#4caf50',
      delivered: '#8bc34a',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const venues = useMemo(() => {
    const set = new Set();
    for (const o of orders) {
      if (o.location && typeof o.location === 'string') set.add(o.location);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const displayedOrders = useMemo(() => {
    let copy = [...filteredOrders];
    if (venueFilter !== 'all') {
      const target = venueFilter.toLowerCase();
      copy = copy.filter(o => (o.location || '').toString().toLowerCase() === target);
    }
    if (sortMode === 'venue-asc') {
      return copy.sort((a, b) => {
        const va = (a.location || '').toString().toLowerCase();
        const vb = (b.location || '').toString().toLowerCase();
        if (va === vb) return new Date(b.createdAt) - new Date(a.createdAt);
        return va.localeCompare(vb);
      });
    }
    if (sortMode === 'venue-desc') {
      return copy.sort((a, b) => {
        const va = (a.location || '').toString().toLowerCase();
        const vb = (b.location || '').toString().toLowerCase();
        if (va === vb) return new Date(b.createdAt) - new Date(a.createdAt);
        return vb.localeCompare(va);
      });
    }
    return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredOrders, sortMode, venueFilter]);

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  // Redirect to login if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null; // Will redirect to login
  }

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="admin-header">
        <h1 className="page-title">{t('admin.dashboard')}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
          </div>
          <div className="stat-label">Active Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'ready').length}
          </div>
          <div className="stat-label">Ready for Pickup</div>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {statusOptions.map(status => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {t(`order.statuses.${status}`)}
          </button>
        ))}
      </div>

      <div className="admin-controls">
        <div className="admin-control">
          <label className="admin-sort-label">{t('order.sortBy', 'Sort by')}</label>
          <select
            className="admin-sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="recent">{t('order.sort.recent', 'Most Recent')}</option>
            <option value="venue-asc">{t('order.sort.venueAZ', 'Venue A → Z')}</option>
            <option value="venue-desc">{t('order.sort.venueZA', 'Venue Z → A')}</option>
          </select>
        </div>

        <div className="admin-control">
          <label className="admin-sort-label">{t('order.filterByVenue', 'Venue')}</label>
          <select
            className="admin-sort-select"
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
          >
            <option value="all">{t('menu.allVenues')}</option>
            {venues.map(v => (
              <option key={v} value={v.toLowerCase()}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="no-orders">
          <p>{t('admin.noOrders')}</p>
        </div>
      ) : (
        <div className="orders-list">
          {displayedOrders.map(order => (
            <div key={order.id} className="order-card admin-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id.slice(0, 8)}</strong>
                  <span className="order-time">
                    {new Date(order.createdAt).toLocaleString(i18n.language)}
                  </span>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {t(`order.statuses.${order.status}`)}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">{t('order.customerName')}:</span>
                  <span>{order.customerName}</span>
                </div>
                {order.customerPhone && (
                  <div className="detail-row">
                    <span className="detail-label">{t('order.customerPhone')}:</span>
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                {order.location && (
                  <div className="detail-row">
                    <span className="detail-label">{t('order.location')}:</span>
                    <span>{order.location}</span>
                  </div>
                )}
                {order.tableNumber && (
                  <div className="detail-row">
                    <span className="detail-label">{t('order.tableNumber')}:</span>
                    <span>{order.tableNumber}</span>
                  </div>
                )}
                {order.paymentMethod && (
                  <div className="detail-row">
                    <span className="detail-label">{t('order.paymentMethod')}:</span>
                    <span>{t(`order.paymentMethods.${order.paymentMethod}`) || order.paymentMethod}</span>
                  </div>
                )}
                {order.notes && (
                  <div className="detail-row">
                    <span className="detail-label">{t('order.notes')}:</span>
                    <span>{order.notes}</span>
                  </div>
                )}
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>
                      {item.name[i18n.language] || item.name.en || item.name} x {item.quantity}
                    </span>
                    <span>{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>{t('menu.total')}: {order.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="admin-actions">
                <div className="status-selector">
                  <label>{t('admin.updateStatus')}:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {t(`order.statuses.${status}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteOrder(order.id)}
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;

