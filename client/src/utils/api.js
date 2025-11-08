import axios from 'axios';

// Configure base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

// Generate or return a persistent anonymous client id
export function getClientId() {
  try {
    const key = 'clientId';
    let id = localStorage.getItem(key);
    if (!id) {
      // simple uuid v4-ish generator
      id = 'cid-' + ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      localStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    // Fallback if localStorage/crypto is unavailable
    return 'cid-fallback';
  }
}

