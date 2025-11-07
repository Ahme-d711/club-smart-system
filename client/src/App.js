import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menus from './pages/Menus';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import MenuImport from './pages/MenuImport';
import Padel from './pages/Padel';
import Cart from './components/Cart';

function App() {
  const { i18n } = useTranslation();

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menus" element={<Menus />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/import" element={<MenuImport />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/padel" element={<Padel />} />
              </Routes>
            </main>
            <Cart />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

