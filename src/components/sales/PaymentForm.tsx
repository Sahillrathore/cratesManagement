
import React from 'react';
import { Sale } from '@/lib/mockData';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, date: string) => void;
  sale?: Sale;
}

const formSchema = z.object({
  amount: z.coerce.number().positive("Must be a positive number"),
  date: z.date({
    required_error: "Date is required",
  }),
});

const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sale,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: sale?.balance || 0,
      date: new Date(),
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.amount, values.date.toISOString());
    form.reset();
  };

  // Update form when sale changes
  React.useEffect(() => {
    if (sale) {
      form.setValue('amount', sale.balance);
    }
  }, [sale, form]);

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Recording payment for sale to {sale.vendorName}
              </p>
              <div className="flex justify-between mb-4">
                <span>Outstanding balance:</span>
                <span className="font-semibold">${sale.balance.toFixed(2)}</span>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0.01" step="0.01" max={sale.balance} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Payment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
