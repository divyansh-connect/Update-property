import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ChannelBadge } from '../../components/CommunicationComponents';
import { CommunicationLayout } from './components/CommunicationLayout';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import { Send, User, MessageSquare, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const CommInboxPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedConvId, setSelectedConvId] = useState<string>('');

  const { data: conversations = [], isLoading: loadConv } = useQuery({
    queryKey: ['comm-conversations-list'],
    queryFn: () => api.conversations.getAll(),
  });

  const { data: messages = [], isLoading: loadMsg } = useQuery({
    queryKey: ['comm-messages-inbox'],
    queryFn: () => api.messages.getAll(),
  });

  // Auto-select first conversation
  const effectiveSelectedId = selectedConvId || conversations[0]?.id || '';
  const activeConv = conversations.find((c) => c.id === effectiveSelectedId) || conversations[0];

  const replyMutation = useMutation({
    mutationFn: (text: string) =>
      api.messages.create({
        sender: 'Property Manager Staff',
        recipient: activeConv?.contactName || 'Tenant',
        body: text,
        channel: 'Chat',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comm-messages-inbox'] }),
  });

  const threadMessages = messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    timestamp: m.timestamp,
  }));

  if (loadConv || loadMsg) return <LoadingSkeleton type="card" />;

  return (
    <CommunicationLayout
      title="Communication Center"
      description="Manage notifications, messages, conversations and your unified inbox."
      breadcrumbs={[
        { label: 'Home', href: '/manager' },
        { label: 'Communication', href: '/manager/communication' },
        { label: 'Unified Inbox' },
      ]}
    >
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">Inbox is empty</h3>
          <p className="text-sm text-muted-foreground max-w-xs">No conversations yet. Messages will appear here when tenants reach out.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)] min-h-[500px]">

          {/* LEFT — Conversation List */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Active Threads</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.slice(0, 20).map((c) => {
                const isSelected = c.id === effectiveSelectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5',
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-sm'
                        : 'bg-secondary/10 hover:bg-secondary/30 border-border/30'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                          {(c.contactName || 'T').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-xs truncate">{c.contactName}</span>
                      </div>
                      <ChannelBadge channel={c.channel} />
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate pl-9">{c.lastMessage}</p>
                    {c.lastActivity && (
                      <span className="text-[9px] text-muted-foreground pl-9 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{c.lastActivity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER — Message Thread via CommunicationPanel */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            {activeConv ? (
              <CommunicationPanel
                entityName={activeConv.contactName}
                tenantPhone={(activeConv as any).phone || ''}
                tenantEmail={(activeConv as any).email || `${activeConv.contactName?.toLowerCase().replace(/\s+/g, '.')}@tenant.com`}
                requestTitle={activeConv.lastMessage || 'Direct Message'}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a conversation to view messages
              </div>
            )}
          </div>

          {/* RIGHT — Contact Profile */}
          <div className="hidden lg:flex lg:col-span-1 bg-card border border-border rounded-xl flex-col overflow-y-auto">
            {activeConv ? (
              <div className="p-5 space-y-5">
                <div className="text-center space-y-3 border-b pb-5">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xl text-primary mx-auto">
                    {(activeConv.contactName || 'T').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">{activeConv.contactName}</h4>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Tenant Account</span>
                  </div>
                  <ChannelBadge channel={activeConv.channel} />
                </div>

                <div className="space-y-3 text-xs font-semibold">
                  {activeConv.assignedUser && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Assigned Manager</p>
                      <p className="font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                        {activeConv.assignedUser}
                      </p>
                    </div>
                  )}
                  {activeConv.lastActivity && (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Last Activity</p>
                      <p className="font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {activeConv.lastActivity}
                      </p>
                    </div>
                  )}
                  <div className="space-y-1 border-t pt-3">
                    <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      {activeConv.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-5 text-center">
                <p className="text-xs text-muted-foreground">Select a conversation to see contact details</p>
              </div>
            )}
          </div>

        </div>
      )}
    </CommunicationLayout>
  );
};

export default CommInboxPage;
