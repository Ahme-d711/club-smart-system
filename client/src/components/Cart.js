import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, isOpen, setIsOpen } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen && cart.length === 0) return null;

  return (
    <>
      <button
        className="cart-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart"
      >
        <span className="cart-icon">🛒</span>
        {cart.length > 0 && (
          <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        )}
      </button>

      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="cart-header">
              <h2>{t('menu.cart')}</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">{t('menu.emptyCart')}</p>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.venueId}`} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name[i18n.language] || item.name.en || item.name}</h4>
                      <p className="cart-item-price">
                        {item.price} {t('common.price')}
                      </p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.venueId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.venueId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id, item.venueId)}
                      >
                        {t('common.remove')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>{t('menu.total')}: {getTotal().toFixed(2)}</strong>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/menus?checkout=true');
                  }}
                >
                  {t('menu.checkout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;

