import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import api from '../../api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ChannelBadge } from '../../components/CommunicationComponents';
import { CommunicationLayout } from './components/CommunicationLayout';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import { User, MessageSquare, Clock, Search, Building2, Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';

export const CommInboxPage: React.FC = () => {
  const routerState = useRouterState();
  const searchParams = new URLSearchParams((routerState.location.search as string) || '');
  const convIdFromUrl = searchParams.get('convId') || '';

  const [selectedConvId, setSelectedConvId] = useState<string>(convIdFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // If URL changes with a new convId, update selection
  useEffect(() => {
    if (convIdFromUrl) setSelectedConvId(convIdFromUrl);
  }, [convIdFromUrl]);

  const { data: conversations = [], isLoading: loadConv } = useQuery({
    queryKey: ['comm-conversations-list'],
    queryFn: () => api.conversations.getAll(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants-list'],
    queryFn: () => api.tenant.getAll(),
  });

  // Filter conversations by search term
  const filteredConversations = conversations.filter((c: any) =>
    c.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select first conversation if none selected
  const effectiveSelectedId = selectedConvId || filteredConversations[0]?.id || conversations[0]?.id || '';
  const activeConv = conversations.find((c: any) => c.id === effectiveSelectedId) || conversations[0];

  // Match tenant profile from frontend tenants state
  const matchingTenant: any = tenants.find((t: any) =>
    activeConv && `${t.firstName} ${t.lastName}`.toLowerCase() === (activeConv.contactName || '').toLowerCase()
  );

  const tenantPhone = (activeConv as any)?.phone || matchingTenant?.phone || '';
  const tenantEmail = (activeConv as any)?.email || matchingTenant?.email || `${(activeConv?.contactName || 'tenant').toLowerCase().replace(/\s+/g, '.')}@tenant.com`;
  const unitNumber = matchingTenant?.unitNumber || (activeConv as any)?.unitNumber || 'N/A';
  const propertyName = matchingTenant?.propertyName || (activeConv as any)?.propertyName || 'Property Unit';

  if (loadConv) return <LoadingSkeleton type="card" />;

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
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-muted/5">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">Inbox is empty</h3>
          <p className="text-sm text-muted-foreground max-w-xs">No active threads yet. Messages will appear here as conversations start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)] min-h-[520px]">

          {/* LEFT — Conversation List (1/4 width) */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-3 border-b border-border space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Active Threads</h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching thread
                </div>
              ) : (
                filteredConversations.map((c: any) => {
                  const isSelected = c.id === effectiveSelectedId;
                  const isUnread = (c.status || '').toLowerCase() === 'unread';
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
                          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-[10px] shrink-0">
                            {(c.contactName || 'T').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-xs truncate flex items-center gap-1.5">
                            {isUnread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                            {c.contactName}
                          </span>
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
                })
              )}
            </div>
          </div>

          {/* CENTER — Message Thread & Composer (2/4 width) */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            {activeConv ? (
              <CommunicationPanel
                entityName={activeConv.contactName}
                tenantPhone={tenantPhone}
                tenantEmail={tenantEmail}
                requestTitle={activeConv.lastMessage || 'Direct Message'}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                Select a conversation to view messages
              </div>
            )}
          </div>

          {/* RIGHT — Dynamic Contact Profile (1/4 width) */}
          <div className="hidden lg:flex lg:col-span-1 bg-card border border-border rounded-xl flex-col overflow-y-auto shadow-sm">
            {activeConv ? (
              <div className="p-5 space-y-5">
                <div className="text-center space-y-3 border-b pb-5">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl mx-auto ring-4 ring-primary/10">
                    {(activeConv.contactName || 'T').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{activeConv.contactName}</h4>
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Tenant Account</span>
                  </div>
                  <div className="flex justify-center">
                    <ChannelBadge channel={activeConv.channel} />
                  </div>
                </div>

                <div className="space-y-3.5 text-xs font-semibold">
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Property Location</p>
                    <p className="font-bold flex items-center gap-1.5 text-foreground">
                      <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {propertyName} • Unit #{unitNumber}
                    </p>
                  </div>

                  {tenantPhone && (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Phone</p>
                      <p className="font-bold flex items-center gap-1.5 text-foreground">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        {tenantPhone}
                      </p>
                    </div>
                  )}

                  {tenantEmail && (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="font-bold flex items-center gap-1.5 text-foreground break-all">
                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                        {tenantEmail}
                      </p>
                    </div>
                  )}

                  {activeConv.assignedUser && (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Assigned Manager</p>
                      <p className="font-bold flex items-center gap-1.5 text-foreground">
                        <User className="w-3.5 h-3.5 text-primary shrink-0" />
                        {activeConv.assignedUser}
                      </p>
                    </div>
                  )}

                  {activeConv.lastActivity && (
                    <div className="space-y-1 border-t pt-3">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Last Activity</p>
                      <p className="font-bold flex items-center gap-1.5 text-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        {activeConv.lastActivity}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1 border-t pt-3">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {activeConv.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-5 text-center">
                <p className="text-xs text-muted-foreground">Select a conversation to see profile</p>
              </div>
            )}
          </div>

        </div>
      )}
    </CommunicationLayout>
  );
};

export default CommInboxPage;
