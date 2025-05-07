
import React, { useState } from 'react';
import { CrateReturn, formatDate } from '@/lib/mockData';
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
import { MoreHorizontal, Trash } from "lucide-react";

interface CrateReturnsListProps {
  returns: CrateReturn[];
  onDelete: (returnId: string) => void;
}

const CrateReturnsList: React.FC<CrateReturnsListProps> = ({ returns, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReturns = returns.filter(ret =>
    ret.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ret.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search returns..."
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
              <TableHead>Crates Returned</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns.length > 0 ? (
              filteredReturns.map((ret) => (
                <TableRow key={ret.id}>
                  <TableCell>{formatDate(ret.date)}</TableCell>
                  <TableCell className="font-medium">{ret.vendorName}</TableCell>
                  <TableCell>{ret.cratesReturned}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => onDelete(ret.id)}
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
                <TableCell colSpan={4} className="text-center py-6">
                  No crate returns found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CrateReturnsList;
