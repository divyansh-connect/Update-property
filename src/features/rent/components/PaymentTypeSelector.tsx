import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DollarSign, CheckCircle, PieChart, AlertCircle } from 'lucide-react';

interface PaymentTypeSelectorProps {
  totalDue: number;
  paymentType: 'full' | 'partial';
  partialAmount: number;
  onPaymentTypeChange: (type: 'full' | 'partial') => void;
  onPartialAmountChange: (amount: number) => void;
}

export const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  totalDue,
  paymentType,
  partialAmount,
  onPaymentTypeChange,
  onPartialAmountChange,
}) => {
  const remainingBalance = Math.max(0, totalDue - (paymentType === 'full' ? totalDue : partialAmount));

  return (
    <div className="space-y-4 border border-border bg-card p-5 rounded-2xl">
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <label className="text-xs font-black uppercase text-muted-foreground tracking-wider block">
            Payment Amount Selection (Client Req #8)
          </label>
          <span className="text-xs font-semibold text-foreground">
            Choose whether to submit full balance or a custom partial payment.
          </span>
        </div>
        <span className="text-sm font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
          Total Owed: ${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Option Switches */}
      <div className="grid grid-cols-2 gap-3">
        {/* Full Payment */}
        <button
          type="button"
          onClick={() => onPaymentTypeChange('full')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            paymentType === 'full'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold ring-2 ring-emerald-500/20'
              : 'border-border hover:bg-secondary/40 text-muted-foreground font-medium'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-4 h-4 ${paymentType === 'full' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-xs font-black uppercase">Full Payment</p>
              <p className="text-[10px] opacity-80">${totalDue.toFixed(2)} (Pays in Full)</p>
            </div>
          </div>
        </button>

        {/* Partial Payment */}
        <button
          type="button"
          onClick={() => onPaymentTypeChange('partial')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
            paymentType === 'partial'
              ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold ring-2 ring-amber-500/20'
              : 'border-border hover:bg-secondary/40 text-muted-foreground font-medium'
          }`}
        >
          <div className="flex items-center space-x-2">
            <PieChart className={`w-4 h-4 ${paymentType === 'partial' ? 'text-amber-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-xs font-black uppercase">Partial Payment</p>
              <p className="text-[10px] opacity-80">Custom Installment / Part</p>
            </div>
          </div>
        </button>
      </div>

      {/* Partial Amount Entry Field */}
      {paymentType === 'partial' && (
        <div className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-amber-500/20 animate-fade-in">
          <label className="text-xs font-extrabold uppercase text-amber-400 block">
            Enter Custom Partial Payment Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              max={totalDue}
              value={partialAmount}
              onChange={(e) => onPartialAmountChange(parseFloat(e.target.value) || 0)}
              className="pl-9 font-black text-sm"
              placeholder="e.g. 500.00"
            />
          </div>

          <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-border/40">
            <span className="text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Remaining Tenant Balance After Payment:
            </span>
            <span className={remainingBalance > 0 ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
              ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTypeSelector;
