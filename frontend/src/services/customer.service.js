import api from './api';

const API_URL = '/customers';

export const getAllCustomers = () => {
  return api.get(API_URL);
};

export const getCustomerById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createCustomer = (data) => {
  return api.post(API_URL, data);
};

export const updateCustomer = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteCustomer = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const customerService = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};

export default customerService;
