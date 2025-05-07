
import React, { useState } from 'react';
import { Sale, formatCurrency, formatDate } from '@/lib/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  DollarSign 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SalesListProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
  onAddPayment: (sale: Sale) => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, onEdit, onDelete, onAddPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(sale =>
    sale.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSaleStatusBadge = (status: 'paid' | 'partial' | 'unpaid') => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500">Partial</Badge>;
      case 'unpaid':
        return <Badge className="bg-destructive">Unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Crates Sold</TableHead>
              <TableHead>Price/Crate</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.date)}</TableCell>
                  <TableCell className="font-medium">{sale.vendorName}</TableCell>
                  <TableCell>{sale.cratesSold}</TableCell>
                  <TableCell>{formatCurrency(sale.pricePerCrate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.amountPaid)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.balance)}</TableCell>
                  <TableCell>{getSaleStatusBadge(sale.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {sale.status !== 'paid' && (
                          <DropdownMenuItem onClick={() => onAddPayment(sale)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Add Payment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(sale)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(sale.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  No sales found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesList;
