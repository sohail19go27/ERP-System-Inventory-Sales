import api from './api';

const API_URL = '/suppliers';

export const getAllSuppliers = () => {
  return api.get(API_URL);
};

export const getSupplierById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createSupplier = (data) => {
  return api.post(API_URL, data);
};

export const updateSupplier = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteSupplier = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const supplierService = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};

export default supplierService;
