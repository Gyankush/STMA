/**
 * Auth Service — handles registration, login, logout, and session hydration.
 */

import api from './api';

const AUTH_TOKEN_KEY = 'stma_access_token';
const AUTH_USER_KEY = 'stma_user';

const authService = {
  /**
   * Register a new user account.
   * Stores the token and user data in localStorage.
   */
  async register({ username, email, password, displayName }) {
    const data = await api.post('/api/auth/register', {
      username,
      email,
      password,
      display_name: displayName,
    }, false);

    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },

  /**
   * Log in with email and password.
   * Stores the token and user data in localStorage.
   */
  async login({ email, password }) {
    const data = await api.post('/api/auth/login', { email, password }, false);

    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },

  /**
   * Log out — clear all stored auth data.
   */
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Get the current user profile from the API.
   * Used to hydrate auth state on app load.
   */
  async getMe() {
    return api.get('/api/auth/me');
  },

  /**
   * Get stored user data from localStorage (synchronous).
   */
  getStoredUser() {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if a token exists in localStorage.
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Get the stored token.
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
};

export default authService;
