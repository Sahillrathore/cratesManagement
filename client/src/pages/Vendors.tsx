
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VendorList from '@/components/vendors/VendorList';
import VendorForm from '@/components/vendors/VendorForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Vendor } from '@/lib/mockData';
import { toast } from 'sonner';

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);

  const baseURL = import.meta.env.VITE_API_URL;
  
  // Load vendors on mount
  useEffect(() => {
    fetch(baseURL+'/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(err => toast.error('Failed to load vendors'));
  }, []);

  // Add vendor
  const handleAddVendor = async (vendorData: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>) => {
    try {
      const res = await fetch(baseURL+'/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const newVendor = await res.json();
      setVendors([...vendors, newVendor]);
      toast.success('Vendor added successfully');
      setIsFormOpen(false);
    } catch (err) {
      toast.error('Failed to add vendor');
    }
  };

  // Edit vendor
  const handleEditVendor = async (vendorData: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>) => {
    if (!editingVendor) return;

    try {
      const res = await fetch(baseURL+`/api/vendors/${editingVendor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const updatedVendor = await res.json();
      setVendors(vendors.map(v => (v._id === updatedVendor._id ? updatedVendor : v)));
      setEditingVendor(undefined);
      setIsFormOpen(false);
      toast.success('Vendor updated successfully');
    } catch (err) {
      toast.error('Failed to update vendor');
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await fetch(baseURL+`/api/vendors/${vendorId}`, { method: 'DELETE' });
      setVendors(vendors.filter(v => v._id !== vendorId));
      toast.success('Vendor deleted successfully');
    } catch (err) {
      toast.error('Failed to delete vendor');
    }
  };
  
  const openEditForm = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendors</h1>
          <p className="text-muted-foreground">Manage your apple crate vendors</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Vendor
        </Button>
      </div>

      <VendorList 
        vendors={vendors}
        onEdit={openEditForm}
        onDelete={handleDeleteVendor}
      />

      <VendorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVendor(undefined);
        }}
        onSubmit={editingVendor ? handleEditVendor : handleAddVendor}
        initialData={editingVendor}
      />
    </MainLayout>
  );
};

export default Vendors;
