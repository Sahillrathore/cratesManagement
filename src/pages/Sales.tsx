
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SalesList from '@/components/sales/SalesList';
import SaleForm from '@/components/sales/SaleForm';
import PaymentForm from '@/components/sales/PaymentForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sale, mockSales, mockVendors } from '@/lib/mockData';
import { toast } from 'sonner';

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);

  const handleAddSale = (saleData: Omit<Sale, 'id'>) => {
    // In a real app, this would be an API call
    const newSale: Sale = {
      id: `s${Date.now()}`,
      ...saleData
    };

    setSales([...sales, newSale]);
    setIsFormOpen(false);
    toast.success('Sale recorded successfully');
  };

  const handleEditSale = (saleData: Omit<Sale, 'id'>) => {
    if (!editingSale) return;

    // In a real app, this would be an API call
    const updatedSales = sales.map(sale => 
      sale.id === editingSale.id ? {
        ...sale,
        ...saleData,
      } : sale
    );

    setSales(updatedSales);
    setEditingSale(undefined);
    setIsFormOpen(false);
    toast.success('Sale updated successfully');
  };

  const handleDeleteSale = (saleId: string) => {
    // In a real app, this would be an API call
    const updatedSales = sales.filter(sale => sale.id !== saleId);
    setSales(updatedSales);
    toast.success('Sale deleted successfully');
  };

  const handleAddPayment = (sale: Sale) => {
    setSelectedSale(sale);
    setIsPaymentFormOpen(true);
  };

  const processPayment = (amount: number, date: string) => {
    if (!selectedSale) return;

    // Calculate new balance
    const newBalance = selectedSale.balance - amount;
    const newAmountPaid = selectedSale.amountPaid + amount;
    
    // Determine new status
    let newStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
    if (newBalance <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partial';
    }

    // Update the sale
    const updatedSales = sales.map(sale =>
      sale.id === selectedSale.id ? {
        ...sale,
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newStatus
      } : sale
    );

    setSales(updatedSales);
    setIsPaymentFormOpen(false);
    setSelectedSale(undefined);
    toast.success(`Payment of $${amount.toFixed(2)} recorded successfully`);
  };

  const openEditForm = (sale: Sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sales</h1>
          <p className="text-muted-foreground">Manage your apple crate sales</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Sale
        </Button>
      </div>

      <SalesList 
        sales={sales}
        onEdit={openEditForm}
        onDelete={handleDeleteSale}
        onAddPayment={handleAddPayment}
      />

      <SaleForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSale(undefined);
        }}
        onSubmit={editingSale ? handleEditSale : handleAddSale}
        initialData={editingSale}
        vendors={mockVendors}
      />

      <PaymentForm
        isOpen={isPaymentFormOpen}
        onClose={() => {
          setIsPaymentFormOpen(false);
          setSelectedSale(undefined);
        }}
        onSubmit={processPayment}
        sale={selectedSale}
      />
    </MainLayout>
  );
};

export default Sales;
