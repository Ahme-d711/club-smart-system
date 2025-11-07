import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Padel.css';

const Padel = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: ''
  });

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate, selectedCourt]);

  const fetchAvailability = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/padel/availability/${selectedDate}?courtNumber=${selectedCourt}`);
      setAvailability(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/padel');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.customerName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/api/padel', {
        date: selectedDate,
        time: selectedTime,
        courtNumber: selectedCourt,
        ...formData
      });
      
      alert(t('padel.bookNow') + ' - ' + t('common.success'));
      setFormData({ customerName: '', customerPhone: '' });
      setSelectedTime('');
      fetchAvailability();
      fetchBookings();
    } catch (error) {
      console.error('Error booking court:', error);
      alert(t('common.error') + ': ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleSlotAvailability = async (slot, isBlocked) => {
    if (!isAdmin) return;
    
    try {
      await api.post('/api/padel/blocks', {
        date: selectedDate,
        time: slot.time,
        courtNumber: selectedCourt,
        block: !isBlocked
      });
      fetchAvailability();
    } catch (error) {
      console.error('Error toggling slot availability:', error);
      alert(t('common.error') + ': ' + (error.response?.data?.error || error.message));
    }
  };

  const availableSlots = availability.filter(slot => slot.available);
  const selectedSlot = availability.find(slot => slot.time === selectedTime);

  return (
    <div className="padel-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('padel.bookCourt')}</h1>
      
      {isAdmin && (
        <div className="admin-notice">
          <strong>{t('padel.adminMode')}</strong>
        </div>
      )}

      <div className="padel-container">
        <div className="booking-form-section">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>{t('padel.selectDate')}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('padel.selectCourt')}</label>
              <select
                value={selectedCourt}
                onChange={(e) => {
                  const court = parseInt(e.target.value);
                  setSelectedCourt(court);
                  setSelectedTime(''); // Reset selected time when court changes
                }}
                required
              >
                <option value={1}>Court 1</option>
                <option value={2}>Court 2</option>
                <option value={3}>Court 3</option>
                <option value={4}>Court 4</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('padel.selectTime')}</label>
              {loading ? (
                <div className="loading">{t('common.loading')}</div>
              ) : (
                <div className="time-slots">
                  {availability.map(slot => {
                    const isBlocked = slot.blocked;
                    const isBooked = !slot.available && !isBlocked;
                    
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        className={`time-slot ${slot.available ? 'available' : (isBlocked ? 'blocked' : 'booked')} ${selectedTime === slot.time ? 'selected' : ''} ${isAdmin ? 'admin-slot' : ''}`}
                        onClick={() => {
                          if (isAdmin) {
                            // Admin can toggle availability
                            toggleSlotAvailability(slot, isBlocked);
                          } else if (slot.available) {
                            // Customer can select available slots
                            setSelectedTime(slot.time);
                          }
                        }}
                        disabled={!isAdmin && !slot.available}
                        title={isAdmin ? (isBlocked ? 'Click to unblock' : slot.available ? 'Click to block' : '') : ''}
                      >
                        {slot.time}
                        {slot.available ? (
                          <span className="slot-status">{t('padel.available')}</span>
                        ) : isBlocked ? (
                          <span className="slot-status">{t('padel.blocked')}</span>
                        ) : (
                          <span className="slot-status">{t('padel.booked')}</span>
                        )}
                        {isAdmin && (
                          <span className="admin-indicator">🔧</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{t('order.customerName')} *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('order.customerPhone')}</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            {selectedTime && selectedSlot && selectedSlot.available && (
              <button type="submit" className="submit-btn">
                {t('padel.bookNow')}
              </button>
            )}
          </form>
        </div>

        <div className="bookings-section">
          <h2>{t('padel.myBookings')}</h2>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings yet</p>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <strong>Court {booking.courtNumber}</strong>
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Customer:</strong> {booking.customerName}</p>
                    {booking.customerPhone && (
                      <p><strong>Phone:</strong> {booking.customerPhone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Padel;

