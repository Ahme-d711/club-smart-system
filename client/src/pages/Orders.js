import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api, { getClientId } from '../utils/api';
import { createSocket } from '../utils/socket';
import './Orders.css';

const Orders = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const response = await api.get('/api/orders', { params: { clientId: getClientId() } });
      // Keep raw list, we will derive sorting in render
      const byRecent = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(byRecent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const venues = useMemo(() => {
    const set = new Set();
    for (const o of orders) {
      if (o.location && typeof o.location === 'string') set.add(o.location);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const displayedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    let copy = [...orders];
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
    // recent
    return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, sortMode, venueFilter]);

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

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="orders-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('order.myOrders')}</h1>

      <div className="orders-controls">
        <div className="orders-control">
          <label className="orders-sort-label">
            {t('order.sortBy', 'Sort by')}
          </label>
          <select
            className="orders-sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="recent">{t('order.sort.recent', 'Most Recent')}</option>
            <option value="venue-asc">{t('order.sort.venueAZ', 'Venue A → Z')}</option>
            <option value="venue-desc">{t('order.sort.venueZA', 'Venue Z → A')}</option>
          </select>
        </div>

        <div className="orders-control">
          <label className="orders-sort-label">
            {t('order.filterByVenue', 'Venue')}
          </label>
          <select
            className="orders-sort-select"
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

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>{t('admin.noOrders')}</p>
        </div>
      ) : (
        <div className="orders-list">
          {displayedOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id.slice(0, 8)}</strong>
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
                <div className="detail-row">
                  <span className="detail-label">{t('order.status')}:</span>
                  <span>{t(`order.statuses.${order.status}`)}</span>
                </div>
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
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleString(i18n.language)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

