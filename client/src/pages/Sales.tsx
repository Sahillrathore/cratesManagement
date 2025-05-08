
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SalesList from '@/components/sales/SalesList';
import SaleForm from '@/components/sales/SaleForm';
import PaymentForm from '@/components/sales/PaymentForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sale } from '@/lib/mockData';
import { toast } from 'sonner';

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);
  const [vendors, setVendors] = useState<[]>();

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(baseURL+'/api/sales')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sales');
        return res.json();
      })
      .then(setSales)
      .catch(err => {
        console.error('Error loading sales:', err);
        toast.error('Failed to load sales');
      });
  }, []);

  useEffect(() => {
    fetch(baseURL+'/api/vendors')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch vendors');
        return res.json();
      })
      .then(setVendors)
      .catch(err => {
        console.error('Error loading vendors:', err);
        toast.error('Failed to load vendors');
      });
  }, []);

  const handleAddSale = async (saleData: Omit<Sale, '_id'>) => {
    console.log('Sending sale data:', saleData); // 👈 debug here

    try {
      const res = await fetch(baseURL+'/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        console.error('Server responded with error:', errMsg);
        throw new Error(errMsg);
      }

      const newSale = await res.json();
      setSales(prev => [...prev, newSale]);
      setIsFormOpen(false);
      toast.success('Sale recorded successfully');
    } catch (err) {
      console.error('Failed to add sale:', err);
      toast.error('Failed to add sale');
    }
  };


  const handleEditSale = async (saleData: Omit<Sale, 'id'>) => {
    if (!editingSale) return;
    try {
      const res = await fetch(baseURL+`/api/sales/${editingSale._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      const updated = await res.json();
      setSales(prev => prev.map(s => s._id === updated._id ? updated : s));
      setEditingSale(undefined);
      setIsFormOpen(false);
      toast.success('Sale updated successfully');
    } catch {
      toast.error('Failed to update sale');
    }
  };


  const handleDeleteSale = async (saleId: string) => {
    try {
      await fetch(baseURL+`/api/sales/${saleId}`, { method: 'DELETE' });
      setSales(prev => prev.filter(s => s._id !== saleId));
      toast.success('Sale deleted successfully');
    } catch {
      toast.error('Failed to delete sale');
    }
  };


  const handleAddPayment = (sale: Sale) => {
    setSelectedSale(sale);
    setIsPaymentFormOpen(true);
  };

  const processPayment = async (amount: number, date: string) => {
    if (!selectedSale) return;

    const newAmountPaid = selectedSale.amountPaid + amount;
    const newBalance = selectedSale.balance - amount;
    const newStatus = newBalance <= 0 ? 'paid' : (newAmountPaid > 0 ? 'partial' : 'unpaid');

    try {
      const res = await fetch(baseURL+`/api/sales/${selectedSale._id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, date })
      });
      const updated = await res.json();
      setSales(prev => prev.map(s => s._id === updated._id ? updated : s));
      toast.success(`Payment of $${amount} recorded successfully`);
    } catch {
      toast.error('Failed to record payment');
    }

    setIsPaymentFormOpen(false);
    setSelectedSale(undefined);
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
        vendors={vendors}
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
