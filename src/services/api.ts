
import axios from 'axios';
import { Vendor, Sale, CrateReturn, Payment } from '@/lib/types';

// Change this to your actual backend URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Vendors API
export const vendorsApi = {
  getAll: async (): Promise<Vendor[]> => {
    const response = await api.get('/vendors');
    return response.data;
  },
  getById: async (id: string): Promise<Vendor> => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },
  create: async (vendor: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>): Promise<Vendor> => {
    const response = await api.post('/vendors', vendor);
    return response.data;
  },
  update: async (id: string, vendor: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>): Promise<Vendor> => {
    const response = await api.put(`/vendors/${id}`, vendor);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vendors/${id}`);
  }
};

// Sales API
export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
  },
  create: async (sale: Omit<Sale, 'id'>): Promise<Sale> => {
    const response = await api.post('/sales', sale);
    return response.data;
  },
  update: async (id: string, sale: Omit<Sale, 'id'>): Promise<Sale> => {
    const response = await api.put(`/sales/${id}`, sale);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
  addPayment: async (saleId: string, amount: number, date: string): Promise<Sale> => {
    const response = await api.post(`/sales/${saleId}/payments`, { amount, date });
    return response.data;
  }
};

// Crate Returns API
export const crateReturnsApi = {
  getAll: async (): Promise<CrateReturn[]> => {
    const response = await api.get('/crate-returns');
    return response.data;
  },
  create: async (crateReturn: Omit<CrateReturn, 'id'>): Promise<CrateReturn> => {
    const response = await api.post('/crate-returns', crateReturn);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/crate-returns/${id}`);
  }
};

// Reports API
export const reportsApi = {
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
  getSalesByVendor: async () => {
    const response = await api.get('/reports/sales-by-vendor');
    return response.data;
  },
  getMonthlySales: async () => {
    const response = await api.get('/reports/monthly-sales');
    return response.data;
  },
  getReceivablesAging: async () => {
    const response = await api.get('/reports/receivables-aging');
    return response.data;
  },
  generateReport: async (reportType: string, format: 'pdf' | 'csv' = 'pdf') => {
    const response = await api.get(`/reports/generate/${reportType}`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default {
  vendors: vendorsApi,
  sales: salesApi,
  crateReturns: crateReturnsApi,
  reports: reportsApi
};
