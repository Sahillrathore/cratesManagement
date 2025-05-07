
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart4, PieChart } from 'lucide-react';
import { reportsApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { 
  ReportSummary, 
  VendorSalesData, 
  MonthlySalesData, 
  ReceivablesAgingData 
} from '@/lib/types';
import { toast } from 'sonner';
import { 
  PieChart as RechartsPreChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Reports = () => {
  // Fetch report data
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['reportSummary'],
    queryFn: () => reportsApi.getSummary(),
  });

  const { data: vendorSalesData, isLoading: isVendorSalesLoading } = useQuery({
    queryKey: ['salesByVendor'],
    queryFn: () => reportsApi.getSalesByVendor(),
  });

  const { data: monthlySalesData, isLoading: isMonthlySalesLoading } = useQuery({
    queryKey: ['monthlySales'],
    queryFn: () => reportsApi.getMonthlySales(),
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleDownload = async (reportType: string) => {
    try {
      const blob = await reportsApi.generateReport(reportType);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType.replace(/\s+/g, '-').toLowerCase()}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success(`${reportType} report downloaded`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  // Summary stats for cards
  const totalSales = summaryData?.totalSales || 0;
  const totalPaid = summaryData?.totalPaid || 0;
  const totalReceivables = summaryData?.totalReceivables || 0;

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
            <p className="text-3xl font-bold">${isSummaryLoading ? '...' : totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${isSummaryLoading ? '...' : totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${isSummaryLoading ? '...' : totalReceivables.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Sales by Vendor</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isVendorSalesLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading vendor data...</p>
              </div>
            ) : vendorSalesData && vendorSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vendorSalesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalSales"
                    nameKey="vendorName"
                    label={({ vendorName, percentageOfTotal }) => `${vendorName}: ${percentageOfTotal.toFixed(1)}%`}
                  >
                    {vendorSalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No vendor sales data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isMonthlySalesLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading monthly data...</p>
              </div>
            ) : monthlySalesData && monthlySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlySalesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted/20 rounded-md">
                <div className="text-center">
                  <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No monthly sales data available</p>
                </div>
              </div>
            )}
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
