import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';
import './Menus.css';

const Menus = () => {
  const { t, i18n } = useTranslation();
  const { addToCart, cart } = useCart();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  // Update checkout modal when search params change
  useEffect(() => {
    if (searchParams.get('checkout') === 'true') {
      setShowCheckout(true);
    } else {
      setShowCheckout(false);
    }
  }, [searchParams]);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/api/menus');
      setMenus(response.data);
      if (response.data.length > 0) {
        setSelectedVenue(response.data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  const currentVenue = menus.find(m => m.id === selectedVenue);
  const categories = currentVenue
    ? [...new Set(currentVenue.items.map(item => item.category))]
    : [];

  const filteredItems = currentVenue
    ? currentVenue.items.filter(
        item => selectedCategory === 'all' || item.category === selectedCategory
      )
    : [];

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="menus-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('menu.browse')}</h1>

      <div className="venue-selector">
        {menus.map(venue => (
          <button
            key={venue.id}
            className={`venue-btn ${selectedVenue === venue.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedVenue(venue.id);
              setSelectedCategory('all');
            }}
          >
            {venue.name[i18n.language] || venue.name.en}
          </button>
        ))}
      </div>

      {currentVenue && (
        <>
          <div className="category-filter">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-items">
            {filteredItems.map(item => (
              <div key={item.id} className="menu-item-card">
                <div className="item-info">
                  <h3>{item.name[i18n.language] || item.name.en}</h3>
                  <p className="item-description">
                    {item.description[i18n.language] || item.description.en}
                  </p>
                  <div className="item-footer">
                    <span className="item-price">{item.price} {t('common.price')}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item, currentVenue.id)}
                    >
                      {t('menu.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => {
            setShowCheckout(false);
            setSearchParams({});
          }}
        />
      )}
    </div>
  );
};

export default Menus;

