import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CreditCard, Landmark, CheckCircle, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { InteractivePaymentModal } from '../tenants/components/InteractivePaymentModal';

export const TenantPaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState('1250');
  const [method, setMethod] = useState('ACH');

  // Queries
  const { data: payments = [], isLoading } = useQuery({ queryKey: ['tenant-payments-list'], queryFn: () => api.tenantPayments.getAll() });

  const payMutation = useMutation({
    mutationFn: (variables?: { amount: number; method: string }) => {
      return api.tenantPayments.payRent({
        amount: variables?.amount || Number(amount),
        method: variables?.method || method,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-payments-list'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-dashboard-metrics'] });
      // Modal handles its own closure after success screen delay
    },
  });

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'date', header: 'Payment Date', id: 'date' },
    { accessorKey: 'method', header: 'Payment Method', id: 'method' },
    {
      accessorKey: 'amount',
      header: 'Amount Paid',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Clearing Status',
      id: 'status',
      cell: ({ row }) => <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">Cleared</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rent Payments & Autopay"
        description="Verify monthly rent balances, enable ACH direct deposits, and download historical payment receipts."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Payments' },
        ]}
        action={{
          label: 'Submit Rent Payment',
          onClick: () => setIsOpen(true),
          icon: <CreditCard className="w-4.5 h-4.5" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Outstanding Rent balance */}
        <Card className="md:col-span-2 p-5 border bg-card flex justify-between items-center text-xs font-semibold">
          <div>
            <h4 className="font-extrabold uppercase text-muted-foreground text-[10px]">Outstanding balance due</h4>
            <p className="text-3xl font-black mt-2 text-emerald-500 flex items-center gap-1.5">
              $0.00
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Next rent period invoices generate on August 1st.</p>
          </div>
          <Button disabled variant="outline" className="border-slate-200 dark:border-white/10 text-muted-foreground bg-transparent">
            No Balance Due
          </Button>
        </Card>

        {/* Autopay status card */}
        <Card className="md:col-span-1 p-5 border bg-card space-y-3 text-xs font-semibold">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Landmark className="w-5 h-5 text-emerald-500 shrink-0" />
            <h4 className="font-extrabold uppercase">Autopay Setup</h4>
          </div>
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <span className="text-emerald-500 font-extrabold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Enabled</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Automatically pulls from Chase checking account ending in XXXX-9822 on the 1st of each month.</p>
        </Card>

      </div>

      <div className="mb-3 text-xs font-bold text-muted-foreground uppercase">Payment history ledger</div>
      <DataTable columns={columns} data={payments} loading={isLoading} />

      {/* RENT PAYMENT DIALOG */}
      <InteractivePaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rentAmount={1250}
        onPaymentSuccess={async (paymentMethod, paymentAmount) => {
          await payMutation.mutateAsync({ amount: paymentAmount, method: paymentMethod.toUpperCase() });
        }}
      />
    </div>
  );
};

// Reusable card container fallback helper
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('bg-card border rounded-2xl p-5', className)}>
    {children}
  </div>
);
export default TenantPaymentsPage;
