/**
 * Auth Context — React context for authentication state management.
 * 
 * Provides:
 * - user: current user object (or null)
 * - isAuthenticated: boolean
 * - isLoading: true while hydrating session on mount
 * - login(email, password): authenticate and store token
 * - register(username, email, password, displayName): create account
 * - logout(): clear session and redirect to login
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ── Hydrate session on mount ─────────────────────────────
  useEffect(() => {
    const hydrate = async () => {
      if (!authService.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        // Token expired or invalid — clear it
        console.warn('Session hydration failed:', error.message);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  // ── Login ────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    return data;
  }, []);

  // ── Register ─────────────────────────────────────────────
  const register = useCallback(async (username, email, password, displayName) => {
    const data = await authService.register({ username, email, password, displayName });
    setUser(data.user);
    return data;
  }, []);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
