import api from './api';

const API_URL = '/dashboard';

export const getSalesSummary = () => {
  return api.get(`${API_URL}/sales-summary`);
};

export const getStockAlerts = () => {
  return api.get(`${API_URL}/stock-alerts`);
};

export const getTopProducts = () => {
  return api.get(`${API_URL}/top-products`);
};

const dashboardService = {
  getSalesSummary,
  getStockAlerts,
  getTopProducts
};

export default dashboardService;
