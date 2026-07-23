import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DollarSign, Printer, Mail, MessageSquare, Send, CheckCircle2, X } from 'lucide-react';

interface CashReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData?: {
    receiptNumber: string;
    tenantName: string;
    tenantPhone?: string;
    tenantEmail?: string;
    propertyName: string;
    unitNumber: string;
    amountPaid: number;
    paymentDate: string;
    receivedBy: string;
    notes?: string;
  };
}

export const CashReceiptModal: React.FC<CashReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData = {
    receiptNumber: `CSH-${Date.now().toString().slice(-6)}`,
    tenantName: 'Sarah Connor',
    tenantPhone: '+1 (555) 234-5678',
    tenantEmail: 'sarah.c@skyline.com',
    propertyName: 'Skyline Heights',
    unitNumber: '4B',
    amountPaid: 1400.00,
    paymentDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Office Collection Manager',
    notes: 'Full July Rent Cash Deposit',
  },
}) => {
  const [dispatchStatus, setDispatchStatus] = useState<string>('');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setDispatchStatus(`Cash Receipt #${receiptData.receiptNumber} emailed successfully to ${receiptData.tenantEmail}!`);
    setTimeout(() => setDispatchStatus(''), 4000);
  };

  const handleSendSMS = () => {
    setDispatchStatus(`Cash Receipt #${receiptData.receiptNumber} sent via SMS to ${receiptData.tenantPhone}!`);
    setTimeout(() => setDispatchStatus(''), 4000);
  };

  const handleWhatsApp = () => {
    const rawPhone = (receiptData.tenantPhone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${receiptData.tenantName},\nThis is your official CASH PAYMENT RECEIPT.\n\nReceipt #: ${receiptData.receiptNumber}\nAmount Received: $${receiptData.amountPaid.toFixed(2)}\nDate: ${receiptData.paymentDate}\nProperty: ${receiptData.propertyName} (Unit ${receiptData.unitNumber})\nReceived By: ${receiptData.receivedBy}\n\nThank you!`
    );
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-card border border-border text-card-foreground rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dispatch Alert Banner */}
        {dispatchStatus && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{dispatchStatus}</span>
          </div>
        )}

        {/* RECEIPT FORMAL DOCUMENT VIEW */}
        <div id="printable-cash-receipt" className="border border-border p-6 rounded-2xl bg-card space-y-5 shadow-inner text-xs">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                OFFICIAL CASH PAYMENT RECEIPT
              </span>
              <h2 className="text-lg font-black mt-1">Skyline Property Management</h2>
              <p className="text-[10px] text-muted-foreground">100 Metropolis Plaza, Suite 400</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-muted-foreground">Receipt No:</span>
              <p className="text-sm font-mono font-black text-primary">{receiptData.receiptNumber}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Date: {receiptData.paymentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-semibold border-b pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Received From Tenant:</span>
              <p className="font-extrabold text-sm text-foreground">{receiptData.tenantName}</p>
              <p className="text-[10px] text-muted-foreground">{receiptData.tenantPhone}</p>
              <p className="text-[10px] text-muted-foreground">{receiptData.tenantEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Property & Unit:</span>
              <p className="font-extrabold text-sm text-foreground">{receiptData.propertyName}</p>
              <p className="text-[10px] text-muted-foreground">Unit #{receiptData.unitNumber}</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Cash Amount Received</span>
              <span className="text-2xl font-black text-emerald-400">${receiptData.amountPaid.toFixed(2)}</span>
            </div>
            <span className="text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              PAID IN CASH
            </span>
          </div>

          <div className="flex justify-between items-end pt-2 text-[10px] text-muted-foreground font-semibold">
            <div>
              <span>Received By: </span>
              <strong className="text-foreground">{receiptData.receivedBy}</strong>
            </div>
            <div className="text-right italic">
              Authorized System Digital Receipt Signature
            </div>
          </div>
        </div>

        {/* MULTI-CHANNEL DISPATCH BUTTONS (REQ #4 & REQ #9) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
            Auto & Manual Dispatch Options (Email, SMS, WhatsApp)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-bold flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail} className="text-xs font-bold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendSMS} className="text-xs font-bold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> SMS
            </Button>
            <Button size="sm" onClick={handleWhatsApp} className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> WhatsApp
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CashReceiptModal;
