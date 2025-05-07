
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CrateReturnsList from '@/components/crates/CrateReturnsList';
import CrateReturnForm from '@/components/crates/CrateReturnForm';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { 
  CrateReturn, 
  mockCrateReturns, 
  mockVendors,
  calculateCrateStatistics 
} from '@/lib/mockData';
import { toast } from 'sonner';
import StatsCard from '@/components/dashboard/StatsCard';

const Crates = () => {
  const [returns, setReturns] = useState<CrateReturn[]>(mockCrateReturns);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(undefined);
  
  // Get crate statistics
  const crateStats = calculateCrateStatistics();

  const handleAddReturn = (vendorId: string, vendorName: string, cratesReturned: number, date: string) => {
    // In a real app, this would be an API call
    const newReturn: CrateReturn = {
      id: `r${Date.now()}`,
      vendorId,
      vendorName,
      cratesReturned,
      date
    };

    setReturns([...returns, newReturn]);
    setIsFormOpen(false);
    toast.success(`${cratesReturned} crates returned by ${vendorName}`);
  };

  const handleDeleteReturn = (returnId: string) => {
    // In a real app, this would be an API call
    const updatedReturns = returns.filter(ret => ret.id !== returnId);
    setReturns(updatedReturns);
    toast.success('Return record deleted');
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Crate Management</h1>
          <p className="text-muted-foreground">Track apple crates sent and returned</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Record Return
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Crates Sent"
          value={crateStats.sent}
          icon={<Package size={20} />}
        />
        <StatsCard
          title="Total Crates Returned"
          value={crateStats.returned}
          icon={<Package size={20} />}
        />
        <StatsCard
          title="Outstanding Crates"
          value={crateStats.outstanding}
          icon={<Package size={20} />}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Crate Return Records</h2>
      <CrateReturnsList 
        returns={returns}
        onDelete={handleDeleteReturn}
      />

      <CrateReturnForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVendorId(undefined);
        }}
        onSubmit={handleAddReturn}
        vendors={mockVendors}
        initialVendorId={selectedVendorId}
      />
    </MainLayout>
  );
};

export default Crates;
