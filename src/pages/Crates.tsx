
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CrateReturnsList from '@/components/crates/CrateReturnsList';
import CrateReturnForm from '@/components/crates/CrateReturnForm';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { CrateReturn } from '@/lib/types';
import { toast } from 'sonner';
import StatsCard from '@/components/dashboard/StatsCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crateReturnsApi, vendorsApi, reportsApi } from '@/services/api';

const Crates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  
  // Get vendors for the form
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendorsApi.getAll(),
  });
  
  // Get crate returns
  const { data: returns = [], isLoading: isReturnsLoading } = useQuery({
    queryKey: ['crateReturns'],
    queryFn: () => crateReturnsApi.getAll(),
  });
  
  // Get crate statistics
  const { data: summaryData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['reportSummary'],
    queryFn: () => reportsApi.getSummary(),
  });

  // Create mutation for adding returns
  const createReturnMutation = useMutation({
    mutationFn: (newReturn: Omit<CrateReturn, 'id'>) => 
      crateReturnsApi.create(newReturn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crateReturns'] });
      queryClient.invalidateQueries({ queryKey: ['reportSummary'] });
      setIsFormOpen(false);
      toast.success('Crate return recorded successfully');
    },
    onError: (error) => {
      console.error('Error adding crate return:', error);
      toast.error('Failed to record crate return');
    },
  });
  
  // Delete mutation for returns
  const deleteReturnMutation = useMutation({
    mutationFn: (id: string) => crateReturnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crateReturns'] });
      queryClient.invalidateQueries({ queryKey: ['reportSummary'] });
      toast.success('Return record deleted');
    },
    onError: (error) => {
      console.error('Error deleting crate return:', error);
      toast.error('Failed to delete return record');
    },
  });

  const handleAddReturn = (vendorId: string, vendorName: string, cratesReturned: number, date: string) => {
    createReturnMutation.mutate({
      vendorId,
      vendorName,
      cratesReturned,
      date
    });
  };

  const handleDeleteReturn = (returnId: string) => {
    deleteReturnMutation.mutate(returnId);
  };

  // Get crate statistics from summary data
  const crateStats = summaryData?.crateStats || { sent: 0, returned: 0, outstanding: 0 };

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
          value={isStatsLoading ? '...' : crateStats.sent}
          icon={<Package size={20} />}
        />
        <StatsCard
          title="Total Crates Returned"
          value={isStatsLoading ? '...' : crateStats.returned}
          icon={<Package size={20} />}
        />
        <StatsCard
          title="Outstanding Crates"
          value={isStatsLoading ? '...' : crateStats.outstanding}
          icon={<Package size={20} />}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Crate Return Records</h2>
      {isReturnsLoading ? (
        <p>Loading crate returns...</p>
      ) : (
        <CrateReturnsList 
          returns={returns}
          onDelete={handleDeleteReturn}
        />
      )}

      <CrateReturnForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVendorId(undefined);
        }}
        onSubmit={handleAddReturn}
        vendors={vendors}
        initialVendorId={selectedVendorId}
      />
    </MainLayout>
  );
};

export default Crates;
