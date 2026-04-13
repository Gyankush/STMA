/**
 * Activity Service — CRUD operations for activity logs.
 */

import api from './api';

const activityService = {
  /**
   * Log a new activity.
   * The backend automatically computes stress score, mismatch type, and lag.
   */
  async create({ taskName, category, timeSpentMin, expectedTimeMin, stressLevel, notes, loggedAt }) {
    return api.post('/api/activities', {
      task_name: taskName,
      category,
      time_spent_min: timeSpentMin,
      expected_time_min: expectedTimeMin,
      stress_level: stressLevel,
      notes,
      logged_at: loggedAt,
    });
  },

  /**
   * Get paginated list of activities.
   * @param {Object} params - { page, limit, from, to }
   */
  async list(params = {}) {
    return api.get('/api/activities', {
      page: params.page || 1,
      limit: params.limit || 20,
      from: params.from,
      to: params.to,
    });
  },

  /**
   * Get a single activity by ID.
   */
  async getById(id) {
    return api.get(`/api/activities/${id}`);
  },

  /**
   * Delete an activity by ID.
   */
  async delete(id) {
    return api.delete(`/api/activities/${id}`);
  },
};

export default activityService;
