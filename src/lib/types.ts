
// Types for the application
export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  cratesHeld: number;
  cratesReturned: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  cratesSold: number;
  pricePerCrate: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
}

export interface CrateReturn {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  cratesReturned: number;
}

export interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  saleId: string;
  date: string;
  amount: number;
}

export interface CrateStatistics {
  sent: number;
  returned: number;
  outstanding: number;
}

export interface ReportSummary {
  totalSales: number;
  totalPaid: number;
  totalReceivables: number;
  crateStats: CrateStatistics;
  activeVendors: number;
}

export interface VendorSalesData {
  vendorId: string;
  vendorName: string;
  totalSales: number;
  percentageOfTotal: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
}

export interface ReceivablesAgingData {
  range: string;
  amount: number;
  percentage: number;
}
