
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import { 
  Crate, 
  DollarSign, 
  Users, 
  BarChart4 
} from 'lucide-react';
import { 
  calculateCrateStatistics, 
  calculateTotalReceivables, 
  getRecentCrateReturns, 
  getRecentSales,
  mockVendors
} from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  // Get statistics
  const crateStats = calculateCrateStatistics();
  const totalReceivables = calculateTotalReceivables();
  const recentSales = getRecentSales().map(sale => ({
    id: sale.id,
    date: sale.date,
    vendorName: sale.vendorName,
    amount: sale.totalAmount,
    status: sale.status
  }));
  const recentReturns = getRecentCrateReturns().map(ret => ({
    id: ret.id,
    date: ret.date,
    vendorName: ret.vendorName,
    quantity: ret.cratesReturned
  }));

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your apple crate management system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Crates Sent"
          value={crateStats.sent}
          icon={<Crate size={20} />}
          description="All-time crates distributed"
        />
        <StatsCard
          title="Outstanding Crates"
          value={crateStats.outstanding}
          icon={<Crate size={20} />}
          description="Waiting to be returned"
          trend={{
            value: 12,
            isPositive: false
          }}
        />
        <StatsCard
          title="Total Receivables"
          value={`$${totalReceivables.toFixed(2)}`}
          icon={<DollarSign size={20} />}
          description="Outstanding payments"
        />
        <StatsCard
          title="Active Vendors"
          value={mockVendors.length}
          icon={<Users size={20} />}
          description="Vendors in database"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Vendor Summary</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
                <div className="text-center">
                  <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Vendor performance summary chart will appear here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <a 
                href="/vendors/new" 
                className="flex items-center p-3 hover:bg-muted rounded-md transition-colors"
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Add New Vendor</span>
              </a>
              <a 
                href="/sales/new" 
                className="flex items-center p-3 hover:bg-muted rounded-md transition-colors"
              >
                <DollarSign className="mr-3 h-5 w-5" />
                <span>Record New Sale</span>
              </a>
              <a 
                href="/crates/returns/new" 
                className="flex items-center p-3 hover:bg-muted rounded-md transition-colors"
              >
                <Crate className="mr-3 h-5 w-5" />
                <span>Record Crate Return</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivityList 
          title="Recent Sales"
          items={recentSales}
          type="sales"
          viewAllLink="/sales"
        />
        <RecentActivityList 
          title="Recent Crate Returns"
          items={recentReturns}
          type="returns"
          viewAllLink="/crates"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
