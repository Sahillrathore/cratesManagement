
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart4, PieChart } from 'lucide-react';
import { mockVendors, mockSales, calculateTotalReceivables } from '@/lib/mockData';

const Reports = () => {
  // Get statistics
  const totalReceivables = calculateTotalReceivables();
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = mockSales.reduce((sum, sale) => sum + sale.amountPaid, 0);

  const handleDownload = (reportType: string) => {
    // In a real app, this would generate and download a report
    console.log(`Downloading ${reportType} report`);
    alert(`In a real app, this would download a ${reportType} report`);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate and view business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalReceivables.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Sales by Vendor</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Pie chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
              <div className="text-center">
                <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Bar chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Sales Summary", description: "Overview of all sales with totals and trends" },
          { title: "Vendor Performance", description: "Analysis of sales and returns by vendor" },
          { title: "Receivables Aging", description: "Breakdown of outstanding receivables by age" },
          { title: "Crate Tracking", description: "Summary of crate distribution and returns" },
          { title: "Payment History", description: "Record of all payments received" },
          { title: "Monthly Sales", description: "Sales data broken down by month" }
        ].map(report => (
          <Card key={report.title} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownload(report.title)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default Reports;
