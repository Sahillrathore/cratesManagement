
import React from 'react';
import { formatCurrency, formatDate } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  title: string;
  items: Array<{
    id: string;
    date: string;
    vendorName: string;
    amount?: number;
    quantity?: number;
    status?: 'paid' | 'partial' | 'unpaid';
  }>;
  type: 'sales' | 'returns';
  viewAllLink: string;
  className?: string;
}

const RecentActivityList: React.FC<RecentActivityProps> = ({
  title,
  items,
  type,
  viewAllLink,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-muted/40 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <a href={viewAllLink} className="text-sm text-primary hover:underline">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id} className="p-4 hover:bg-muted/40">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.vendorName}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                  </div>
                  <div className="text-right">
                    {type === 'sales' && item.amount !== undefined && (
                      <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    )}
                    {type === 'returns' && item.quantity !== undefined && (
                      <p className="font-semibold">{item.quantity} crates</p>
                    )}
                    {item.status && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        item.status === 'paid' ? "bg-success/20 text-success" : 
                        item.status === 'partial' ? "bg-amber-500/20 text-amber-700" :
                        "bg-destructive/20 text-destructive"
                      )}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-muted-foreground">No recent {type}</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
