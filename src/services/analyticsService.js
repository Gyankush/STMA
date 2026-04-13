/**
 * Analytics Service — dashboard summary, mismatch analysis, and stress-lag chain.
 */

import api from './api';

const analyticsService = {
  /**
   * Get the main dashboard analytics summary.
   * @param {number} days - Number of days to look back (default: 7)
   */
  async getDashboard(days = 7) {
    return api.get('/api/analytics/dashboard', { days });
  },

  /**
   * Get the time-stress mismatch analysis.
   * @param {number} days - Number of days to look back (default: 30)
   */
  async getMismatch(days = 30) {
    return api.get('/api/analytics/mismatch', { days });
  },

  /**
   * Get the stress-lag carry-over chain analysis.
   * @param {number} days - Number of days to look back (default: 7)
   */
  async getStressLag(days = 7) {
    return api.get('/api/analytics/stress-lag', { days });
  },

  /**
   * Get AI-generated stress insights from Gemini.
   * Analyzes recent activities and returns triggers, strategies, and flow tips.
   */
  async getAIInsights() {
    return api.get('/api/analytics/ai-insights');
  },
};

export default analyticsService;
