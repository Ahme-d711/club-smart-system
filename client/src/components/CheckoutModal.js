import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { getClientId } from '../utils/api';
import { useCart } from '../context/CartContext';
import './CheckoutModal.css';

const CheckoutModal = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { cart, clearCart, getTotal } = useCart();
  const [formData, setFormData] = useState({
    location: '',
    tableNumber: '',
    customerName: '',
    customerPhone: '',
    paymentMethod: 'cash', // Default to cash
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if cart is empty
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const orderData = {
        items: orderItems,
        ...formData,
        tableNumber: formData.tableNumber || undefined,
        clientId: getClientId()
      };

      await api.post('/api/orders', orderData);
      clearCart();
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert(t('common.error') + ': ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2>{t('order.orderPlaced')}</h2>
          <p>Your order has been placed successfully!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2>{t('order.newOrder')}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>{t('order.location')}</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">{t('order.location')}</option>
              <option value="hotel-room">Hotel Room</option>
              <option value="pool-area">Pool Area</option>
              <option value="padel-court">Padel Court</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Café</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('order.tableNumber')} ({t('common.cancel')})</label>
            <input
              type="number"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>{t('order.customerName')}</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('order.customerPhone')}</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t('order.paymentMethod')}</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="cash">{t('order.paymentMethods.cash')}</option>
              <option value="credit-card">{t('order.paymentMethods.creditCard')}</option>
              <option value="club-card">{t('order.paymentMethods.clubCard')}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('order.notes')}</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Special instructions..."
            />
          </div>

          <div className="order-summary">
            <h3>{t('menu.cart')}</h3>
            {cart.length === 0 ? (
              <p className="empty-cart-message">{t('menu.emptyCart')}</p>
            ) : (
              <>
                {cart.map((item) => {
                  // Handle both object format (name.en, name.ar) and string format
                  const itemName = typeof item.name === 'object' 
                    ? (item.name[i18n.language] || item.name.en || item.name)
                    : item.name;
                  
                  return (
                    <div key={`${item.id}-${item.venueId}`} className="summary-item">
                      <span>{itemName} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="summary-total">
                  <strong>{t('menu.total')}: {getTotal().toFixed(2)}</strong>
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-submit" disabled={loading || cart.length === 0}>
              {loading ? t('common.loading') : t('order.placeOrder')}
            </button>
          </div>

          <p className="payment-note">
            {t('order.paymentNote')}
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;

