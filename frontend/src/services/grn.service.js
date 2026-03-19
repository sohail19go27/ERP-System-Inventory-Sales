import api from './api';

const API_URL = '/grns';

export const getAllGRNs = () => {
  return api.get(API_URL);
};

export const createGRN = (data) => {
  return api.post(API_URL, data);
};

const grnService = {
  getAllGRNs,
  createGRN
};

export default grnService;
