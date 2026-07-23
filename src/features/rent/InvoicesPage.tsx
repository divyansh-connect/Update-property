import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Invoice } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { InvoiceDeliveryModal } from './components/InvoiceDeliveryModal';
import { ItemizedInvoiceModal } from './components/ItemizedInvoiceModal';
import { FilterBar } from '../../components/FilterBar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Eye, Trash2, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Queries
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices-list'],
    queryFn: () => api.invoices.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.invoices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-list'] });
      setDeleteId(null);
    },
  });

  const filteredInvoices = invoices.filter((inv) => {
    const nameMatch = inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || inv.status === statusFilter;
    return nameMatch && matchesStatus;
  });

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice #',
      id: 'id',
      cell: ({ row }) => (
        <span
          onClick={() => setSelectedInvoice(row.original)}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {row.original.id}
        </span>
      ),
    },
    { accessorKey: 'tenantName', header: 'Tenant', id: 'tenantName' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'dueDate', header: 'Due Date', id: 'dueDate' },
    {
      accessorKey: 'amount',
      header: 'Amount Due',
      id: 'amount',
      cell: ({ row }) => <span className="font-semibold">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'balance',
      header: 'Outstanding Balance',
      id: 'balance',
      cell: ({ row }) => (
        <span className={row.original.balance > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
          ${row.original.balance.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(row.original)} title="View Details">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Invoice"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices Manager"
        description="Verify resident monthly invoices billing distributions, itemized charges, and overdue alerts."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Invoices' },
        ]}
        action={{
          label: 'Create Invoice',
          onClick: () => navigate({ to: '/manager/invoices/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search invoices by tenant name..."
        filters={[
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Sent', value: 'Sent' },
              { label: 'Overdue', value: 'Overdue' },
              { label: 'Draft', value: 'Draft' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredInvoices} loading={isLoading} error={error ? error.message : null} />

      {/* DETAILED INVOICE MODAL */}
      <ItemizedInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        onRecordPayment={() => {
          setSelectedInvoice(null);
          navigate({ to: '/manager/payments/new' });
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Invoice Statement"
        description="Are you sure you want to delete this invoice? The transaction debit will be reversed."
        confirmText="Delete Invoice"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default InvoicesPage;
