import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DollarSign, CreditCard, X, Calendar, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdvancePaymentData {
  id?: string;
  workOrderId: string;
  workOrderTitle: string;
  vendorOrStaffName: string;
  totalCost: number;
  advancePaid: number;
  remainingOwed: number;
  paymentMethod: string;
  referenceNumber: string;
  date: string;
  notes?: string;
}

interface AdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: AdvancePaymentData) => void;
  initialWorkOrder?: {
    id: string;
    title: string;
    vendorName?: string;
    totalCost?: number;
  };
}

export const AdvancePaymentModal: React.FC<AdvancePaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialWorkOrder,
}) => {
  const [workOrderId, setWorkOrderId] = useState(initialWorkOrder?.id || 'WO-1042');
  const [workOrderTitle, setWorkOrderTitle] = useState(initialWorkOrder?.title || 'Roof Repair & Gutter Cleaning');
  const [vendorOrStaffName, setVendorOrStaffName] = useState(initialWorkOrder?.vendorName || 'Apex Roofing & Plumbing Services');
  const [totalCost, setTotalCost] = useState<number>(initialWorkOrder?.totalCost || 1500);
  const [advancePaid, setAdvancePaid] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState<string>(`ADV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('Advance paid for raw material procurement prior to work commencement.');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const remainingOwed = Math.max(0, totalCost - advancePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advancePaid <= 0) {
      setError('Advance payment amount must be greater than $0.');
      return;
    }
    if (advancePaid > totalCost) {
      setError('Advance payment cannot exceed the total estimated cost.');
      return;
    }

    onSave({
      id: `adv-${Date.now()}`,
      workOrderId,
      workOrderTitle,
      vendorOrStaffName,
      totalCost,
      advancePaid,
      remainingOwed,
      paymentMethod,
      referenceNumber,
      date,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border text-foreground rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground">Record Maintenance Advance Payment</h3>
              <p className="text-xs text-muted-foreground">Track vendor or staff advance payout & remaining balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Work Order Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Work Order ID</label>
              <Input
                value={workOrderId}
                onChange={(e) => setWorkOrderId(e.target.value)}
                placeholder="e.g. WO-1042"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Work Title</label>
              <Input
                value={workOrderTitle}
                onChange={(e) => setWorkOrderTitle(e.target.value)}
                placeholder="e.g. Plumbing Repair"
                required
              />
            </div>
          </div>

          {/* Vendor / Staff Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Vendor / Personnel Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                className="pl-9"
                value={vendorOrStaffName}
                onChange={(e) => setVendorOrStaffName(e.target.value)}
                placeholder="e.g. John Miller (Technician) / Apex Plumbing"
                required
              />
            </div>
          </div>

          {/* Cost Amounts Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-secondary/30 border rounded-xl">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Total Cost Estimate ($)</label>
              <Input
                type="number"
                min="0"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-emerald-500">Advance Amount Paid ($)</label>
              <Input
                type="number"
                min="0"
                value={advancePaid}
                onChange={(e) => {
                  setError('');
                  setAdvancePaid(Number(e.target.value));
                }}
                required
              />
            </div>
          </div>

          {/* LIVE BALANCE CALCULATION BOX */}
          <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Remaining Balance Owed:</span>
            <span className={`text-base font-extrabold ${remainingOwed > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              ${remainingOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground font-semibold"
              >
                <option value="Bank Transfer">Bank Transfer (ACH)</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="Credit Card">Company Credit Card</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Payment Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ref Number & Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Reference / Transaction #</label>
            <Input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. REF-892019"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Payment Notes / Purpose</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground font-medium"
              placeholder="Additional comments or material cost breakdown..."
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Save Advance Payment
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdvancePaymentModal;
