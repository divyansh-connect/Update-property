import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { CommunicationPanel } from '../../components/CommunicationPanel';
import {
  Phone, Mail, MessageCircle, Wrench,
  CheckCircle, AlertCircle, X
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';

// ─── Toast System ─────────────────────────────────────────────────────────────
interface Toast { id: string; type: 'success' | 'error' | 'info'; message: string; }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (type: Toast['type'], message: string) => {
    const id = `t-${Date.now()}`;
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  const remove = (id: string) => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, show, remove };
}

function ToastBar({ toasts, remove }: { toasts: Toast[]; remove: (id: string) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold min-w-[260px] animate-in slide-in-from-right duration-300 ${
            t.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white'
            : t.type === 'error'  ? 'bg-rose-600 border-rose-500 text-white'
            : 'bg-primary border-primary/80 text-white'
          }`}
        >
          {t.type === 'success'
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Mock Ticket Data ──────────────────────────────────────────────────────────
const MOCK_TICKETS = [
  { id: 'SR-33', title: 'Plumbing Repair Request #33',    tenantName: 'Joseph Anderson', tenantPhone: '+15552345678', tenantEmail: 'joseph.anderson@rentals.com',   propertyName: 'Northside Industrial', priority: 'High',   status: 'In Progress' },
  { id: 'SR-21', title: 'Electrical Repair Request',      tenantName: 'John Williams',   tenantPhone: '+15559876543', tenantEmail: 'john.williams@rentals.com',     propertyName: 'Downtown Plaza',       priority: 'Urgent', status: 'Submitted'  },
  { id: 'SR-18', title: 'HVAC Repair Request',            tenantName: 'Patricia Brown',  tenantPhone: '+15551112222', tenantEmail: 'patricia.brown@rentals.com',    propertyName: 'Sunset Villas',        priority: 'Medium', status: 'Approved'   },
  { id: 'SR-11', title: 'Appliance Repair Request',       tenantName: 'Robert Jones',    tenantPhone: '+15553334444', tenantEmail: 'robert.jones@rentals.com',      propertyName: 'Northside Industrial', priority: 'Low',    status: 'Assigned'   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export const CommMessagesPage: React.FC = () => {
  const { toasts, show, remove } = useToast();
  const [selectedId, setSelectedId] = useState<string>(MOCK_TICKETS[0].id);

  const { data: apiRequests = [] } = useQuery({
    queryKey: ['maintenance-requests-comm'],
    queryFn: async () => {
      try { if (api.serviceRequests) return await api.serviceRequests.getAll(); return []; }
      catch { return []; }
    },
  });

  const tickets = (apiRequests.length > 0 ? apiRequests : MOCK_TICKETS) as typeof MOCK_TICKETS;
  const ticket  = tickets.find(t => t.id === selectedId) ?? tickets[0];
  const cleanPhone = (ticket.tenantPhone ?? '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${ticket.tenantName}, we are updating you on your maintenance request: "${ticket.title}". Please let us know if you have questions.`
  )}`;

  const onWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    show('success', `WhatsApp opened for ${ticket.tenantName}`);
  };

  const onCall = () => {
    window.location.href = `tel:${ticket.tenantPhone}`;
    show('info', `Calling ${ticket.tenantName} — ${ticket.tenantPhone}`);
  };

  const onEmail = () => {
    window.location.href = `mailto:${ticket.tenantEmail}?subject=${encodeURIComponent('RE: ' + ticket.title)}`;
    show('info', `Email client opened for ${ticket.tenantEmail}`);
  };

  return (
    <div className="space-y-6 text-foreground">
      <ToastBar toasts={toasts} remove={remove} />

      <PageHeader
        title="In-App Maintenance Communication Hub"
        description="Reply directly to tenant maintenance requests in-app, launch WhatsApp messages, or initiate direct phone calls and emails."
        breadcrumbs={[
          { label: 'Home', href: '/communication' },
          { label: 'Maintenance Messages' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Ticket List */}
        <Card className="lg:col-span-1 p-4 border bg-card flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-500" /> Active Maintenance Tickets
            </h3>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {tickets.length} Tickets
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {tickets.map(req => (
              <button
                key={req.id}
                onClick={() => setSelectedId(req.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                  selectedId === req.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-secondary/20 hover:bg-secondary/40 border-border/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-xs line-clamp-1">{req.title}</span>
                  <StatusBadge status={req.status ?? 'Open'} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{req.tenantName}</span>
                  <span>{req.propertyName}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* RIGHT — Detail + Communication */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Ticket Banner */}
          <Card className="p-4 border bg-gradient-to-r from-card via-card/90 to-primary/5 border-primary/20 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase bg-primary text-white px-2 py-0.5 rounded">
                  #{ticket.id}
                </span>
                <h2 className="font-extrabold text-base text-foreground">{ticket.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="font-bold text-foreground">{ticket.tenantName}</span>
                <span>•</span>
                <span>{ticket.propertyName}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onWhatsApp}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Launcher
              </button>

              <button
                onClick={onCall}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow"
              >
                <Phone className="w-4 h-4" /> Call ({ticket.tenantPhone})
              </button>

              <button
                onClick={onEmail}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 active:scale-95 text-foreground border border-border transition-all"
              >
                <Mail className="w-4 h-4 text-primary" /> Email
              </button>
            </div>
          </Card>

          {/* Communication Panel */}
          <CommunicationPanel
            entityName={ticket.tenantName}
            tenantPhone={ticket.tenantPhone}
            tenantEmail={ticket.tenantEmail}
            requestTitle={ticket.title}
            onLogAdd={log =>
              show('success', `${log.type} sent to ${ticket.tenantName}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CommMessagesPage;
