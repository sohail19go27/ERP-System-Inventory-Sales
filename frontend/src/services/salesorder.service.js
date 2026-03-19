import api from './api';

const API_URL = '/sales';

export const getAllSalesOrders = () => {
  return api.get(API_URL);
};

export const getSalesOrderById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createSalesOrder = (data) => {
  return api.post(API_URL, data);
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`${API_URL}/${id}/status`, { status });
};

export const deleteSalesOrder = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const salesOrderService = {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateOrderStatus,
  deleteSalesOrder
};

export default salesOrderService;
