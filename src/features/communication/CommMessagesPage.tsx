import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Card } from '../../components/ui/Card';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import { CommunicationLayout } from './components/CommunicationLayout';
import { Phone, Mail, MessageCircle, Wrench } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';

export const CommMessagesPage: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('maint-1');

  const { data: requests = [] } = useQuery({
    queryKey: ['maintenance-requests-comm'],
    queryFn: async () => {
      try {
        if (api.serviceRequests) return await api.serviceRequests.getAll();
        return [];
      } catch (e) {
        return [];
      }
    },
  });

  const activeRequest: any = requests.find((r: any) => r.id === selectedTicketId) || requests[0] || {
    id: 'maint-1',
    title: 'Water Leak in Bathroom Ceiling',
    tenantName: 'Sarah Jenkins',
    tenantPhone: '+1 (555) 234-5678',
    tenantEmail: 'sarah.j@rentals.com',
    propertyName: 'Sunset Heights Loft #402',
    property: 'Sunset Heights Loft #402',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-07-22',
  };

  const tenantPhone = activeRequest.tenantPhone || '+1 (555) 234-5678';
  const tenantEmail = activeRequest.tenantEmail || 'tenant@rentals.com';
  const cleanPhone = tenantPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${activeRequest.tenantName}, updating you regarding maintenance ticket #${activeRequest.id}: "${activeRequest.title}"`)}`;

  return (
    <CommunicationLayout
      title="Communication Center"
      description="Manage notifications, messages, conversations and your unified inbox."
      breadcrumbs={[
        { label: 'Home', href: '/manager' },
        { label: 'Communication', href: '/manager/communication' },
        { label: 'Maintenance Messages' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Maintenance Tickets Selector */}
        <Card className="lg:col-span-1 p-4 border bg-card flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-500" />
              Active Maintenance Tickets
            </h3>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {requests.length || 5} Tickets
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {(requests.length > 0 ? requests : [
              { id: 'maint-1', title: 'Water Leak in Bathroom Ceiling', tenantName: 'Sarah Jenkins', propertyName: 'Sunset Heights #402', priority: 'Urgent', status: 'In Progress' },
              { id: 'maint-2', title: 'HVAC Air Conditioning Not Cooling', tenantName: 'Michael Chang', propertyName: 'Oakwood Apartments #105', priority: 'High', status: 'Open' },
              { id: 'maint-3', title: 'Broken Garbage Disposal Unit', tenantName: 'Emily Davis', propertyName: 'Grand Avenue Towers #812', priority: 'Medium', status: 'Pending' },
            ]).map((req: any) => (
              <button
                key={req.id}
                onClick={() => setSelectedTicketId(req.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                  selectedTicketId === req.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-secondary/20 hover:bg-secondary/40 border-border/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs line-clamp-1">{req.title}</span>
                  <StatusBadge status={req.status || 'Open'} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{req.tenantName || 'Tenant'}</span>
                  <span>{req.propertyName || req.property || 'Property Unit'}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* RIGHT COLUMN: Interactive Communication & WhatsApp Launcher Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Ticket Banner */}
          <Card className="p-4 border bg-gradient-to-r from-card via-card/90 to-primary/5 border-primary/20 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase bg-primary text-white px-2 py-0.5 rounded">
                  #{activeRequest.id}
                </span>
                <h2 className="font-extrabold text-base text-foreground">{activeRequest.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="font-bold text-foreground">{activeRequest.tenantName || 'Tenant'}</span>
                <span>•</span>
                <span>{activeRequest.propertyName || activeRequest.property || 'Main Building Unit'}</span>
              </p>
            </div>

            {/* Quick Action Launchers */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Launcher
              </a>
              <a
                href={`tel:${tenantPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow"
              >
                <Phone className="w-4 h-4" />
                Call ({tenantPhone})
              </a>
              <a
                href={`mailto:${tenantEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all"
              >
                <Mail className="w-4 h-4 text-primary" />
                Email
              </a>
            </div>
          </Card>

          {/* Communication Panel */}
          <CommunicationPanel
            entityName={activeRequest.tenantName || 'Tenant'}
            tenantPhone={tenantPhone}
            tenantEmail={tenantEmail}
            requestTitle={activeRequest.title}
          />
        </div>
      </div>
    </CommunicationLayout>
  );
};

export default CommMessagesPage;
