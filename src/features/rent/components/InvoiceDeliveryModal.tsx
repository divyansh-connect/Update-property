import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Mail, MessageSquare, Send, CheckCircle2, X, RefreshCw } from 'lucide-react';

interface InvoiceDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData?: {
    id: string;
    tenantName: string;
    tenantPhone?: string;
    tenantEmail?: string;
    propertyName: string;
    unitNumber: string;
    amount: number;
    dueDate: string;
  };
}

export const InvoiceDeliveryModal: React.FC<InvoiceDeliveryModalProps> = ({
  isOpen,
  onClose,
  invoiceData = {
    id: 'INV-2026-089',
    tenantName: 'Sarah Connor',
    tenantPhone: '+1 (555) 234-5678',
    tenantEmail: 'sarah.c@skyline.com',
    propertyName: 'Skyline Heights',
    unitNumber: '4B',
    amount: 1400.00,
    dueDate: '2026-08-01',
  },
}) => {
  const [autoEmail, setAutoEmail] = useState(true);
  const [autoSMS, setAutoSMS] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSendEmail = () => {
    setStatusMsg(`Invoice #${invoiceData.id} sent to ${invoiceData.tenantEmail} via Email!`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleSendSMS = () => {
    setStatusMsg(`Invoice #${invoiceData.id} dispatched to ${invoiceData.tenantPhone} via SMS!`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleWhatsApp = () => {
    const rawPhone = (invoiceData.tenantPhone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${invoiceData.tenantName},\nYour monthly invoice #${invoiceData.id} of $${invoiceData.amount.toFixed(2)} for ${invoiceData.propertyName} (Unit ${invoiceData.unitNumber}) is due on ${invoiceData.dueDate}.\n\nYou can pay directly online via your Tenant Portal.\nThank you!`
    );
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-card border border-border text-card-foreground rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b pb-3 pr-8">
          <span className="text-[10px] font-black uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            Invoice Dispatch & Auto-Send Settings
          </span>
          <h2 className="text-lg font-black mt-1">Deliver Rent Invoice / Receipt</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Client Requirement #4: Manage automated delivery and manual dispatch options.
          </p>
        </div>

        {statusMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Invoice Summary Box */}
        <div className="bg-secondary/30 border border-border p-4 rounded-xl space-y-2 text-xs font-semibold">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice Reference:</span>
            <span className="font-mono font-bold text-foreground">{invoiceData.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tenant Payer:</span>
            <span className="font-bold text-foreground">{invoiceData.tenantName} ({invoiceData.unitNumber})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Due:</span>
            <span className="font-black text-emerald-500 text-sm">${invoiceData.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* 1. AUTOMATED MONTHLY INVOICE SETTINGS */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-primary" /> Automated Monthly Delivery Settings
          </label>
          <div className="space-y-2 text-xs font-bold">
            <label className="flex items-center justify-between p-3 bg-card border rounded-xl cursor-pointer hover:bg-secondary/20 transition">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>Auto-Send Monthly Invoices via Email</span>
              </div>
              <input
                type="checkbox"
                checked={autoEmail}
                onChange={(e) => setAutoEmail(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-card border rounded-xl cursor-pointer hover:bg-secondary/20 transition">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Auto-Send Monthly Invoices via SMS/Text</span>
              </div>
              <input
                type="checkbox"
                checked={autoSMS}
                onChange={(e) => setAutoSMS(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* 2. MANUAL DIRECT DISPATCH BUTTONS */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
            Manual Instant Dispatch Channels
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={handleSendEmail} className="text-xs font-bold flex items-center justify-center gap-1 py-2.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendSMS} className="text-xs font-bold flex items-center justify-center gap-1 py-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> SMS
            </Button>
            <Button size="sm" onClick={handleWhatsApp} className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 py-2.5">
              <Send className="w-3.5 h-3.5" /> WhatsApp
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDeliveryModal;
