
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VendorList from '@/components/vendors/VendorList';
import VendorForm from '@/components/vendors/VendorForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Vendor, mockVendors } from '@/lib/mockData';
import { toast } from 'sonner';

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);

  const handleAddVendor = (vendorData: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>) => {
    // In a real app, this would be an API call
    const newVendor: Vendor = {
      id: `v${Date.now()}`,
      cratesHeld: 0,
      cratesReturned: 0,
      createdAt: new Date().toISOString(),
      ...vendorData
    };

    setVendors([...vendors, newVendor]);
    setIsFormOpen(false);
    toast.success('Vendor added successfully');
  };

  const handleEditVendor = (vendorData: Omit<Vendor, 'id' | 'cratesHeld' | 'cratesReturned' | 'createdAt'>) => {
    if (!editingVendor) return;

    // In a real app, this would be an API call
    const updatedVendors = vendors.map(vendor => 
      vendor.id === editingVendor.id ? {
        ...vendor,
        ...vendorData
      } : vendor
    );

    setVendors(updatedVendors);
    setEditingVendor(undefined);
    setIsFormOpen(false);
    toast.success('Vendor updated successfully');
  };

  const handleDeleteVendor = (vendorId: string) => {
    // In a real app, this would be an API call
    const updatedVendors = vendors.filter(vendor => vendor.id !== vendorId);
    setVendors(updatedVendors);
    toast.success('Vendor deleted successfully');
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
