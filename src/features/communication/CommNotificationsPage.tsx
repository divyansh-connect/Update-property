import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { CheckCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const CommNotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: notifications = [], isLoading } = useQuery({ 
    queryKey: ['comm-notifications-list'], 
    queryFn: () => api.notifications.getAll() 
  });

  const markMutation = useMutation({
    mutationFn: (id: string) => api.notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comm-notifications-list'] });
    },
  });

  const handleNotificationClick = (item: any) => {
    if (item.status === 'Unread') {
      markMutation.mutate(item.id);
    }
    
    let target = item.targetPath || item.link;
    if (!target) {
      const typeLower = (item.type || '').toLowerCase();
      const titleLower = (item.title || '').toLowerCase();
      const bodyLower = (item.body || '').toLowerCase();

      if (typeLower.includes('payment') || titleLower.includes('payment') || titleLower.includes('rent') || bodyLower.includes('paid')) {
        target = item.entityId ? `/payments/${item.entityId}` : '/payments';
      } else if (typeLower.includes('maintenance') || titleLower.includes('maintenance') || titleLower.includes('repair') || bodyLower.includes('ac') || bodyLower.includes('plumbing') || bodyLower.includes('work order')) {
        target = item.entityId ? `/maintenance/requests/${item.entityId}` : '/maintenance/requests';
      } else if (typeLower.includes('tenant') || titleLower.includes('tenant') || titleLower.includes('applicant')) {
        target = item.entityId ? `/tenants/${item.entityId}` : '/tenants';
      } else if (typeLower.includes('lease') || titleLower.includes('lease') || titleLower.includes('expir')) {
        target = item.entityId ? `/leasing/leases/${item.entityId}` : '/leasing/leases';
      } else if (typeLower.includes('invoice') || titleLower.includes('invoice') || titleLower.includes('bill')) {
        target = item.entityId ? `/invoices/${item.entityId}` : '/invoices';
      } else if (typeLower.includes('violation') || titleLower.includes('violation')) {
        target = '/maintenance/violations';
      } else {
        target = '/communication/messages';
      }
    }

    navigate({ to: target as any });
  };

  const filteredNotif = notifications.filter((n: any) =>
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.body?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'createdAt', header: 'Created At', id: 'date' },
    { 
      accessorKey: 'type', 
      header: 'Alert Type', 
      id: 'type', 
      cell: ({ row }) => <span className="font-extrabold text-[9px] uppercase bg-secondary border px-2 py-0.5 rounded">{row.original.type || 'Alert'}</span> 
    },
    { 
      accessorKey: 'title', 
      header: 'Subject Alert', 
      id: 'title', 
      cell: ({ row }) => (
        <button 
          onClick={() => handleNotificationClick(row.original)}
          className="font-bold text-left hover:text-primary hover:underline flex items-center gap-1.5 group"
        >
          <span>{row.original.title}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
        </button>
      ) 
    },
    { 
      accessorKey: 'body', 
      header: 'Message Context Detail', 
      id: 'body', 
      cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.original.body}</span> 
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
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNotificationClick(row.original)}
            className="h-7 text-xs gap-1 font-bold text-primary border-primary/30 hover:bg-primary/10"
          >
            <ExternalLink className="w-3 h-3" />
            Open 1-Click
          </Button>
          {row.original.status === 'Unread' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => markMutation.mutate(row.original.id)} 
              title="Mark as read"
              className="h-7 w-7"
            >
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="System Alerts & Notifications"
        description="Click any alert to navigate directly to its detail page in 1-click."
        breadcrumbs={[
          { label: 'Home', href: '/communication' },
          { label: 'Notifications' },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notifications..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredNotif.slice(0, 100)} loading={isLoading} />
    </div>
  );
};
export default CommNotificationsPage;

