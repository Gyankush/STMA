/**
 * Category Service — CRUD operations for user-customizable categories.
 */

import api from './api';

const categoryService = {
  /**
   * List all categories for the current user.
   */
  async list() {
    return api.get('/api/categories');
  },

  /**
   * Create a new custom category.
   * @param {Object} params - { name, color, icon }
   */
  async create({ name, color, icon }) {
    return api.post('/api/categories', { name, color, icon });
  },

  /**
   * Update an existing category.
   * @param {number} id - Category ID
   * @param {Object} params - { name?, color?, icon? }
   */
  async update(id, params = {}) {
    return api.put(`/api/categories/${id}`, params);
  },

  /**
   * Delete a custom category.
   * @param {number} id - Category ID
   */
  async delete(id) {
    return api.delete(`/api/categories/${id}`);
  },
};

export default categoryService;
