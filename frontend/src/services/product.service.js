import api from './api';

const API_URL = '/products';

export const getAllProducts = () => {
  return api.get(API_URL);
};

export const getProductById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createProduct = (productData) => {
  return api.post(API_URL, productData);
};

export const updateProduct = (id, productData) => {
  return api.put(`${API_URL}/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;
