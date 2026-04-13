/**
 * API Service — Axios instance with JWT interceptor.
 * 
 * All API calls go through this instance, which automatically:
 * - Attaches the Bearer token from localStorage
 * - Redirects to login on 401 responses
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Custom fetch wrapper with JWT auth and JSON handling.
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get the stored auth token.
   */
  getToken() {
    return localStorage.getItem('stma_access_token');
  }

  /**
   * Build headers with optional auth token.
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  /**
   * Handle response — parse JSON and handle errors.
   */
  async handleResponse(response) {
    if (response.status === 401) {
      // Token expired or invalid — clear auth and redirect
      localStorage.removeItem('stma_access_token');
      localStorage.removeItem('stma_user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  }

  /**
   * GET request.
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * POST request.
   */
  async post(endpoint, body = {}, includeAuth = true) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * PUT request.
   */
  async put(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE request.
   */
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

const api = new ApiClient(API_BASE_URL);
export default api;
