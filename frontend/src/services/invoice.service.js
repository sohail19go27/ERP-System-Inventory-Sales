import api from './api';

const API_URL = '/invoices';

export const getAllInvoices = () => {
  return api.get(API_URL);
};

export const downloadInvoicePdf = (id) => {
  return api.get(`${API_URL}/${id}/pdf`, { responseType: 'blob' });
};

const invoiceService = {
  getAllInvoices,
  downloadInvoicePdf
};

export default invoiceService;
