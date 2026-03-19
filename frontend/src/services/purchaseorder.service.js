import api from './api';

const API_URL = '/purchase-orders';

export const getAllPurchaseOrders = () => {
  return api.get(API_URL);
};

export const getPurchaseOrderById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createPurchaseOrder = (data) => {
  return api.post(API_URL, data);
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`${API_URL}/${id}/status`, { status });
};

export const deletePurchaseOrder = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const purchaseOrderService = {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updateOrderStatus,
  deletePurchaseOrder
};

export default purchaseOrderService;
