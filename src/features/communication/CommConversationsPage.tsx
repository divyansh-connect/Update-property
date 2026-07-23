import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { ChannelBadge } from '../../components/CommunicationComponents';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CommunicationLayout } from './components/CommunicationLayout';
import { MessageCircle, CheckCheck, Eye, Inbox, Filter } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { clsx } from 'clsx';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Conversations' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'unread', label: 'Unread' },
];

export const CommConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['comm-conversations-list'],
    queryFn: () => api.conversations.getAll(),
  });

  const filteredConv = conversations.filter((c: any) => {
    const matchesSearch =
      c.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const statusLower = (c.status || '').toLowerCase();
    if (activeFilter === 'open') return statusLower === 'open' || statusLower === 'active';
    if (activeFilter === 'resolved') return statusLower === 'resolved' || statusLower === 'closed';
    if (activeFilter === 'unread') return statusLower === 'unread';

    return true;
  });

  const totalCount = conversations.length;
  const openCount = conversations.filter((c: any) => (c.status || '').toLowerCase() === 'open' || (c.status || '').toLowerCase() === 'active').length;
  const resolvedCount = conversations.filter((c: any) => (c.status || '').toLowerCase() === 'resolved' || (c.status || '').toLowerCase() === 'closed').length;
  const unreadCount = conversations.filter((c: any) => (c.status || '').toLowerCase() === 'unread').length;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'contactName',
      header: 'Contact',
      id: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 ring-2 ring-primary/10">
            {(row.original.contactName || 'T').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-sm text-foreground block">{row.original.contactName}</span>
            <span className="text-[10px] text-muted-foreground font-semibold">Tenant</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'lastMessage',
      header: 'Last Message',
      id: 'lastMessage',
      cell: ({ row }) => (
        <span className="truncate max-w-[260px] inline-block font-medium text-muted-foreground text-sm">
          {row.original.lastMessage}
        </span>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      id: 'channel',
      cell: ({ row }) => <ChannelBadge channel={row.original.channel} />,
    },
    {
      accessorKey: 'assignedUser',
      header: 'Assigned Manager',
      id: 'agent',
      cell: ({ row }) => (
        <span className="font-semibold text-sm text-foreground">{row.original.assignedUser || '—'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      id: 'activity',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-muted-foreground">{row.original.lastActivity || '—'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-extrabold gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary transition-all"
            onClick={() => navigate({ to: '/manager/communication/inbox' as any })}
          >
            <Eye className="w-3.5 h-3.5" />
            View Thread
          </Button>
        </div>
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
        { label: 'Conversations Log' },
      ]}
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Total Threads</p>
          </div>
        </div>
        <div className="bg-card border border-amber-500/20 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-amber-500/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-500">{openCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Open Threads</p>
          </div>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-emerald-500/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-500">{resolvedCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Resolved</p>
          </div>
        </div>
        <div className="bg-card border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:border-rose-500/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-500">{unreadCount}</p>
            <p className="text-xs font-semibold text-muted-foreground">Unread</p>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap border',
              activeFilter === filter.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by contact name or last message..."
        onReset={() => { setSearchQuery(''); setActiveFilter('all'); }}
      />

      {isLoading ? (
        <LoadingSkeleton type="table" />
      ) : filteredConv.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-muted/5">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">No conversations found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {searchQuery || activeFilter !== 'all'
              ? 'No conversation matches your search or filter.'
              : 'Active threads will appear here.'}
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredConv.slice(0, 100)} />
      )}
    </CommunicationLayout>
  );
};

export default CommConversationsPage;
