import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CommunicationLayout } from './components/CommunicationLayout';
import { CheckCheck, ArrowRight, Bell, BellOff, CreditCard, Wrench, Users, FileText, ShieldAlert, MessageSquare, AlertCircle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { clsx } from 'clsx';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  payment: <CreditCard className="w-3.5 h-3.5 text-emerald-500" />,
  maintenance: <Wrench className="w-3.5 h-3.5 text-amber-500" />,
  tenant: <Users className="w-3.5 h-3.5 text-blue-500" />,
  lease: <FileText className="w-3.5 h-3.5 text-purple-500" />,
  violation: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />,
  message: <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />,
};

const getCategoryIcon = (type: string = '') => {
  const t = type.toLowerCase();
  if (t.includes('payment') || t.includes('rent')) return CATEGORY_ICONS.payment;
  if (t.includes('maintenance') || t.includes('repair')) return CATEGORY_ICONS.maintenance;
  if (t.includes('tenant') || t.includes('applicant')) return CATEGORY_ICONS.tenant;
  if (t.includes('lease') || t.includes('expir')) return CATEGORY_ICONS.lease;
  if (t.includes('violation')) return CATEGORY_ICONS.violation;
  return CATEGORY_ICONS.message;
};

const getRelativeTime = (dateStr: string) => {
  if (!dateStr) return '—';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const FILTER_CHIPS = [
  { id: 'all', label: 'All Alerts' },
  { id: 'unread', label: 'Unread' },
  { id: 'payment', label: 'Payments' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'lease', label: 'Leasing' },
  { id: 'system', label: 'System Alerts' },
];

export const CommNotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('all');

  const { data: notifications = [], isLoading, isError } = useQuery({
    queryKey: ['comm-notifications-list'],
    queryFn: () => api.notifications.getAll(),
  });

  const markMutation = useMutation({
    mutationFn: (id: string) => api.notifications.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comm-notifications-list'] }),
  });

  const handleNotificationClick = (item: any) => {
    if (item.status === 'Unread') markMutation.mutate(item.id);

    let target = item.targetPath || item.link;
    if (!target) {
      const typeLower = (item.type || '').toLowerCase();
      const titleLower = (item.title || '').toLowerCase();
      const bodyLower = (item.body || '').toLowerCase();

      if (typeLower.includes('payment') || titleLower.includes('payment') || titleLower.includes('rent') || bodyLower.includes('paid')) {
        target = item.entityId ? `/manager/payments/${item.entityId}` : '/manager/payments';
      } else if (typeLower.includes('maintenance') || titleLower.includes('maintenance') || titleLower.includes('repair')) {
        target = item.entityId ? `/manager/maintenance/requests/${item.entityId}` : '/manager/maintenance/requests';
      } else if (typeLower.includes('tenant') || titleLower.includes('tenant') || titleLower.includes('applicant')) {
        target = item.entityId ? `/manager/tenants/${item.entityId}` : '/manager/tenants';
      } else if (typeLower.includes('lease') || titleLower.includes('lease') || titleLower.includes('expir')) {
        target = item.entityId ? `/manager/leasing/leases/${item.entityId}` : '/manager/leasing/leases';
      } else if (typeLower.includes('invoice') || titleLower.includes('invoice') || titleLower.includes('bill')) {
        target = item.entityId ? `/manager/invoices/${item.entityId}` : '/manager/invoices';
      } else if (typeLower.includes('violation') || titleLower.includes('violation')) {
        target = '/manager/maintenance/violations';
      } else {
        target = '/manager/communication/messages';
      }
    }
    navigate({ to: target as any });
  };

  const filteredNotif = notifications.filter((n: any) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeChip === 'unread') return n.status === 'Unread';
    if (activeChip === 'payment') return (n.type || '').toLowerCase().includes('payment') || (n.title || '').toLowerCase().includes('payment');
    if (activeChip === 'maintenance') return (n.type || '').toLowerCase().includes('maintenance') || (n.title || '').toLowerCase().includes('maintenance');
    if (activeChip === 'lease') return (n.type || '').toLowerCase().includes('lease') || (n.title || '').toLowerCase().includes('lease');
    if (activeChip === 'system') return (n.type || '').toLowerCase().includes('system') || (n.type || '').toLowerCase().includes('alert');

    return true;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n: any) => n.status === 'Unread').length;
  const readCount = totalCount - unreadCount;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      id: 'date',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          {getRelativeTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Category',
      id: 'type',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {getCategoryIcon(row.original.type)}
          <span className="font-extrabold text-[9px] uppercase bg-secondary border px-2 py-0.5 rounded tracking-wide">
            {row.original.type || 'Alert'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Notification Title',
      id: 'title',
      cell: ({ row }) => (
        <button
          onClick={() => handleNotificationClick(row.original)}
          className="font-bold text-left hover:text-primary hover:underline flex items-center gap-1.5 group cursor-pointer"
        >
          {row.original.status === 'Unread' && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
          )}
          <span>{row.original.title}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
        </button>
      ),
    },
    {
      accessorKey: 'body',
      header: 'Details',
      id: 'body',
      cell: ({ row }) => (
        <span className="font-medium text-muted-foreground text-xs max-w-[320px] block truncate">
          {row.original.body}
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
      header: '',
      cell: ({ row }) => (
        row.original.status === 'Unread' ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => markMutation.mutate(row.original.id)}
            title="Mark as read"
            className="h-7 w-7 hover:bg-emerald-500/10 hover:text-emerald-600"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <CommunicationLayout
      title="Communication Center"
      description="Manage notifications, messages, conversations and your unified inbox."
      breadcrumbs={[
        { label: 'Home', href: '/manager' },
        { label: 'Communication', href: '/manager/communication' },
        { label: 'Notifications' },
      ]}
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Total Notifications</p>
          </div>
        </div>
        <div className="bg-card border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-rose-500/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-500">{unreadCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Unread Alerts</p>
          </div>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-emerald-500/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <BellOff className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-500">{readCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Read Alerts</p>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveChip(chip.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap border',
              activeChip === chip.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notifications by title or message..."
        onReset={() => { setSearchQuery(''); setActiveChip('all'); }}
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-rose-500/20 rounded-2xl bg-rose-500/5">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
          <h3 className="text-base font-bold text-foreground mb-1">Failed to load notifications</h3>
          <p className="text-xs text-muted-foreground">Please refresh the page or try again later.</p>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton type="table" />
      ) : filteredNotif.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-muted/5">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">No notifications found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {searchQuery || activeChip !== 'all'
              ? 'No notifications match your search or filter options.'
              : 'All system alerts will appear here. Check back soon!'}
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredNotif.slice(0, 100)} />
      )}
    </CommunicationLayout>
  );
};

export default CommNotificationsPage;
