import React, { useEffect } from 'react';
import { Sale, Vendor } from '@/lib/mockData'; // Types should be defined in a separate file
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface SaleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Sale, '_id'>) => void;
  initialData?: Sale;
  vendors: Vendor[];
}

const formSchema = z.object({
  vendorId: z.string().min(1, "Vendor is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  cratesSold: z.coerce.number().positive("Must be a positive number"),
  pricePerCrate: z.coerce.number().positive("Must be a positive number"),
  amountPaid: z.coerce.number().min(0, "Cannot be negative"),
});

const SaleForm: React.FC<SaleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  vendors,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      vendorId: initialData.vendorId,
      date: new Date(initialData.saleDate),
      cratesSold: initialData.cratesSold,
      pricePerCrate: initialData.pricePerCrate,
      amountPaid: initialData.amountPaid,
    } : {
      vendorId: "",
      date: new Date(),
      cratesSold: 0,
      pricePerCrate: 0,
      amountPaid: 0,
    },
  });

  const cratesSold = form.watch("cratesSold");
  const pricePerCrate = form.watch("pricePerCrate");
  const amountPaid = form.watch("amountPaid");

  const totalAmount = cratesSold * pricePerCrate;
  const balance = totalAmount - amountPaid;

  const determineStatus = (): 'paid' | 'partial' | 'unpaid' => {
    if (balance <= 0) return 'paid';
    if (amountPaid > 0) return 'partial';
    return 'unpaid';
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedVendor = vendors.find(v => v._id === values.vendorId);
    if (!selectedVendor) return;

    const saleData: Omit<Sale, '_id'> = {
      vendorId: values.vendorId,
      vendorName: selectedVendor.name,
      saleDate: values.date.toISOString(),
      cratesSold: values.cratesSold,
      pricePerCrate: values.pricePerCrate,
      totalAmount,
      amountPaid: values.amountPaid,
      balance,
      status: determineStatus(),
    };

    onSubmit(saleData);
    form.reset();
  };

  useEffect(() => {
    if (isOpen) {
      form.reset(initialData ? {
        vendorId: initialData.vendorId,
        date: new Date(initialData.saleDate), // ✅
        cratesSold: initialData.cratesSold,
        pricePerCrate: initialData.pricePerCrate,
        amountPaid: initialData.amountPaid,
      } : {
        vendorId: "",
        date: new Date(),
        cratesSold: 0,
        pricePerCrate: 0,
        amountPaid: 0,
      });

    }
  }, [isOpen, initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Sale' : 'Record New Sale'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cratesSold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crates Sold</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerCrate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Crate ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>Total Amount</FormLabel>
                <div className="p-2 border rounded-md bg-muted/20">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>

              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Paid ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>Balance Due</FormLabel>
                <div className={cn("p-2 border rounded-md", balance <= 0 ? "bg-success/20" : "bg-destructive/20")}>
                  ${balance.toFixed(2)}
                </div>
              </div>

              <div>
                <FormLabel>Status</FormLabel>
                <div className={cn("p-2 border rounded-md",
                  determineStatus() === 'paid' ? "bg-success/20 text-success" :
                    determineStatus() === 'partial' ? "bg-amber-500/20 text-amber-700" :
                      "bg-destructive/20 text-destructive")}>
                  {determineStatus() === 'paid' ? 'Paid' :
                    determineStatus() === 'partial' ? 'Partially Paid' : 'Unpaid'}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{initialData ? 'Save Changes' : 'Record Sale'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleForm;
