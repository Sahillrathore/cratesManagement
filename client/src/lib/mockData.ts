
// Generating realistic mock data for the apple crate business

export interface Vendor {
  _id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  initialBalance: number;
  address: string;
  cratesHeld: number;
  cratesReturned: number;
  createdAt: string;
}

export interface Sale {
  _id: string;
  vendorId: string;
  vendorName: string;
  saleDate: string;
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



// Mock Sales
export const mockSales: Sale[] = [
  {
    _id: "s1",
    vendorId: "v1",
    vendorName: "Valley Fresh Market",
    saleDate: "2023-05-01T10:30:00Z",
    cratesSold: 25,
    pricePerCrate: 42.50,
    totalAmount: 1062.50,
    amountPaid: 1062.50,
    balance: 0,
    status: "paid",
  },
  {
    _id: "s2",
    vendorId: "v2",
    vendorName: "Urban Grocery Co-op",
    saleDate: "2023-05-05T11:45:00Z",
    cratesSold: 30,
    pricePerCrate: 45.00,
    totalAmount: 1350.00,
    amountPaid: 1000.00,
    balance: 350.00,
    status: "partial",
  },
  {
    _id: "s3",
    vendorId: "v3",
    vendorName: "Northwest Farmers Market",
    saleDate: "2023-05-10T09:15:00Z",
    cratesSold: 40,
    pricePerCrate: 41.75,
    totalAmount: 1670.00,
    amountPaid: 0,
    balance: 1670.00,
    status: "unpaid",
  },
  {
    _id: "s4",
    vendorId: "v1",
    vendorName: "Valley Fresh Market",
    saleDate: "2023-05-15T14:20:00Z",
    cratesSold: 20,
    pricePerCrate: 42.50,
    totalAmount: 850.00,
    amountPaid: 850.00,
    balance: 0,
    status: "paid",
  },
  {
    _id: "s5",
    vendorId: "v4",
    vendorName: "Family Foods",
    saleDate: "2023-05-20T13:10:00Z",
    cratesSold: 15,
    pricePerCrate: 43.00,
    totalAmount: 645.00,
    amountPaid: 645.00,
    balance: 0,
    status: "paid",
  },
  {
    _id: "s6",
    vendorId: "v5",
    vendorName: "Green Valley Grocers",
    saleDate: "2023-05-25T10:30:00Z",
    cratesSold: 35,
    pricePerCrate: 44.00,
    totalAmount: 1540.00,
    amountPaid: 1000.00,
    balance: 540.00,
    status: "partial",
  },
];

// Mock Crate Returns
export const mockCrateReturns: CrateReturn[] = [
  {
    id: "r1",
    vendorId: "v1",
    vendorName: "Valley Fresh Market",
    date: "2023-05-10T15:45:00Z",
    cratesReturned: 15,
  },
  {
    id: "r2",
    vendorId: "v2",
    vendorName: "Urban Grocery Co-op",
    date: "2023-05-12T16:30:00Z",
    cratesReturned: 20,
  },
  {
    id: "r3",
    vendorId: "v3",
    vendorName: "Northwest Farmers Market",
    date: "2023-05-18T14:15:00Z",
    cratesReturned: 10,
  },
  {
    id: "r4",
    vendorId: "v4",
    vendorName: "Family Foods",
    date: "2023-05-22T11:20:00Z",
    cratesReturned: 5,
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "p1",
    vendorId: "v1",
    vendorName: "Valley Fresh Market",
    saleId: "s1",
    date: "2023-05-01T10:30:00Z",
    amount: 1062.50,
  },
  {
    id: "p2",
    vendorId: "v2",
    vendorName: "Urban Grocery Co-op",
    saleId: "s2",
    date: "2023-05-05T11:45:00Z",
    amount: 1000.00,
  },
  {
    id: "p3",
    vendorId: "v1",
    vendorName: "Valley Fresh Market",
    saleId: "s4",
    date: "2023-05-15T14:20:00Z",
    amount: 850.00,
  },
  {
    id: "p4",
    vendorId: "v4",
    vendorName: "Family Foods",
    saleId: "s5",
    date: "2023-05-20T13:10:00Z",
    amount: 645.00,
  },
  {
    id: "p5",
    vendorId: "v5",
    vendorName: "Green Valley Grocers",
    saleId: "s6",
    date: "2023-05-25T10:30:00Z",
    amount: 1000.00,
  },
];

// Helper functions

// Calculate total receivables
export const calculateTotalReceivables = () => {
  return mockSales.reduce((total, sale) => total + sale.balance, 0);
};

// Calculate vendor-specific receivables
export const calculateVendorReceivables = (vendorId: string) => {
  return mockSales
    .filter(sale => sale.vendorId === vendorId)
    .reduce((total, sale) => total + sale.balance, 0);
};

// Calculate total crates statistics
export const calculateCrateStatistics = () => {
  const totalSent = mockSales.reduce((total, sale) => total + sale.cratesSold, 0);
  const totalReturned = mockCrateReturns.reduce((total, ret) => total + ret.cratesReturned, 0);
  
  return {
    sent: totalSent,
    returned: totalReturned,
    outstanding: totalSent - totalReturned
  };
};

// Calculate vendor-specific crate statistics
export const calculateVendorCrateStatistics = (vendorId: string) => {
  const vendorSales = mockSales.filter(sale => sale.vendorId === vendorId);
  const vendorReturns = mockCrateReturns.filter(ret => ret.vendorId === vendorId);
  
  const totalSent = vendorSales.reduce((total, sale) => total + sale.cratesSold, 0);
  const totalReturned = vendorReturns.reduce((total, ret) => total + ret.cratesReturned, 0);
  
  return {
    sent: totalSent,
    returned: totalReturned,
    outstanding: totalSent - totalReturned
  };
};

// Get recent sales (last 5)
export const getRecentSales = () => {
  return [...mockSales]
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 5);
};

// Get recent crate returns (last 5)
export const getRecentCrateReturns = () => {
  return [...mockCrateReturns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

// Format date for display
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
