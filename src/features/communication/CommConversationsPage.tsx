import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { ChannelBadge } from '../../components/CommunicationComponents';
import { StatusBadge } from '../../components/StatusBadge';
import { CommunicationLayout } from './components/CommunicationLayout';
import { MessageCircle, CheckCheck, Eye, Users, Inbox } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const CommConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['comm-conversations-list'],
    queryFn: () => api.conversations.getAll(),
  });

  const filteredConv = conversations.filter((c) =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {(row.original.contactName || 'T').slice(0, 2).toUpperCase()}
          </div>
          <span className="font-bold text-sm">{row.original.contactName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'lastMessage',
      header: 'Last Message',
      id: 'lastMessage',
      cell: ({ row }) => (
        <span className="truncate max-w-[220px] inline-block font-medium text-muted-foreground text-sm">
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
      header: 'Assigned To',
      id: 'agent',
      cell: ({ row }) => (
        <span className="font-semibold text-sm">{row.original.assignedUser || '—'}</span>
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
            className="h-7 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
            onClick={() => navigate({ to: '/manager/communication/inbox' as any })}
          >
            <Eye className="w-3 h-3" />
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
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xl font-black">{totalCount}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="bg-card border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xl font-black text-amber-500">{openCount}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Open</p>
          </div>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-xl font-black text-emerald-500">{resolvedCount}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Resolved</p>
          </div>
        </div>
        <div className="bg-card border border-rose-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Inbox className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-xl font-black text-rose-500">{unreadCount}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">Unread</p>
          </div>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by contact name or last message..."
        onReset={() => setSearchQuery('')}
      />

      {!isLoading && filteredConv.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold mb-1">No conversations found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search filter.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredConv.slice(0, 100)} loading={isLoading} />
      )}
    </CommunicationLayout>
  );
};

export default CommConversationsPage;
