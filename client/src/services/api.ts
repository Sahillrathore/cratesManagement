
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


export const crateReturnsApi = {
  getAll: async () => {
    const res = await fetch('http://localhost:5000/api/crate-returns');
    if (!res.ok) throw new Error('Failed to fetch crate returns');
    return res.json();
  },
  create: async (data: {
    vendorId: string;
    vendorName: string;
    cratesReturned: number;
    date: string;
  }) => {
    const res = await fetch('http://localhost:5000/api/crate-returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create crate return');
    return res.json();
  },
  delete: async (id: string) => {
    const res = await fetch(`/api/crate-returns/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete return');
    return res.json();
  },
};

export const reportsApi = {
  getSummary: async () => {
    const res = await fetch('/api/reports/summary');
    if (!res.ok) throw new Error('Failed to load report summary');
    return res.json();
  }
};


export default {
  vendors: vendorsApi,
  sales: salesApi,
  crateReturns: crateReturnsApi,
  reports: reportsApi
};
