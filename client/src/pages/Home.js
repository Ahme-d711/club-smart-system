import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('app.welcome')}</h1>
          <p className="hero-subtitle">
            {t('app.title')}
          </p>
          <p className="hero-description">
            Order food and drinks from anywhere in the club. Experience seamless service at your fingertips.
          </p>
          <div className="hero-buttons">
            <Link to="/menus" className="btn btn-primary">
              {t('menu.browse')}
            </Link>
            <Link to="/padel" className="btn btn-secondary">
              {t('padel.bookCourt')}
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🍽️</div>
          <h3>Order Anywhere</h3>
          <p>Order from hotel rooms, pool area, padel courts, or any table</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Service</h3>
          <p>Real-time order tracking and quick delivery</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Mobile Friendly</h3>
          <p>Works seamlessly on mobile, tablet, and desktop</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>Bilingual</h3>
          <p>Available in Arabic and English</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

