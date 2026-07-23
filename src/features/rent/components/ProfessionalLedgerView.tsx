import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Printer, Download, ArrowLeft, Building2, User, Phone, MapPin, DollarSign } from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: 'Rent Charge' | 'Payment' | 'Late Fee' | 'Deposit' | 'Credit';
  debit: number;
  credit: number;
  balance: number;
}

interface ProfessionalLedgerViewProps {
  onBack?: () => void;
  tenantInfo?: {
    companyName: string;
    tenantName: string;
    tenantPhone: string;
    tenantEmail: string;
    propertyAddress: string;
    propertyName: string;
    unitNumber: string;
    leaseStart: string;
    leaseEnd: string;
  };
  ledgerItems?: LedgerEntry[];
}

export const ProfessionalLedgerView: React.FC<ProfessionalLedgerViewProps> = ({
  onBack,
  tenantInfo = {
    companyName: 'Skyline Real Estate & Property Management LLC',
    tenantName: 'Sarah Connor',
    tenantPhone: '+1 (555) 234-5678',
    tenantEmail: 'sarah.c@skyline.com',
    propertyAddress: '100 Metropolis Plaza, Los Angeles, CA 90001',
    propertyName: 'Skyline Heights Complex',
    unitNumber: 'Apartment #4B',
    leaseStart: '2025-08-01',
    leaseEnd: '2026-08-01',
  },
  ledgerItems = [
    { id: '1', date: '2026-05-01', description: 'Monthly Rent Charge - May 2026', type: 'Rent Charge', debit: 1400.00, credit: 0, balance: 1400.00 },
    { id: '2', date: '2026-05-02', description: 'ACH Payment - Ref #ACH-9821', type: 'Payment', debit: 0, credit: 1400.00, balance: 0.00 },
    { id: '3', date: '2026-06-01', description: 'Monthly Rent Charge - June 2026', type: 'Rent Charge', debit: 1400.00, credit: 0, balance: 1400.00 },
    { id: '4', date: '2026-06-03', description: 'Online Card Payment - Ref #CRD-4410', type: 'Payment', debit: 0, credit: 1400.00, balance: 0.00 },
    { id: '5', date: '2026-07-01', description: 'Monthly Rent Charge - July 2026', type: 'Rent Charge', debit: 1400.00, credit: 0, balance: 1400.00 },
  ],
}) => {
  const currentBalance = ledgerItems.length > 0 ? ledgerItems[ledgerItems.length - 1].balance : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-foreground">
      
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-2xl print:hidden">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-1 font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Ledger List
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            Professional Statement Format (Client Req #5)
          </span>
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-1.5 font-bold">
            <Printer className="w-4 h-4" /> Print / Save PDF Statement
          </Button>
        </div>
      </div>

      {/* FORMAL STATEMENT DOCUMENT */}
      <Card id="printable-tenant-ledger" className="p-8 border border-border bg-card space-y-8 shadow-lg font-sans">
        
        {/* STATEMENT HEADER: COMPANY & LOGO */}
        <div className="flex justify-between items-start border-b-2 border-primary/20 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-7 h-7 text-primary" />
              <h1 className="text-xl font-black tracking-tight">{tenantInfo.companyName}</h1>
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Official Resident Account & Financial Transaction History
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Statement Date</span>
            <span className="text-xs font-mono font-bold text-foreground">{new Date().toLocaleDateString()}</span>
            <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-right">
              <span className="text-[9px] uppercase font-bold text-emerald-400 block">Current Balance Owed</span>
              <span className="text-lg font-black text-emerald-400">${currentBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* TENANT & PROPERTY DETAILS GRID (REQUIRED BY CLIENT REQ #5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/20 p-5 rounded-2xl border border-border/60 text-xs">
          {/* Tenant Box */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-primary" /> Resident Details
            </span>
            <p className="font-extrabold text-sm text-foreground">{tenantInfo.tenantName}</p>
            <p className="text-muted-foreground flex items-center gap-1 font-semibold">
              <Phone className="w-3.5 h-3.5" /> {tenantInfo.tenantPhone}
            </p>
            <p className="text-muted-foreground font-semibold">{tenantInfo.tenantEmail}</p>
          </div>

          {/* Property & Unit Box */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Property & Apartment Unit Location
            </span>
            <p className="font-extrabold text-sm text-foreground">{tenantInfo.propertyName}</p>
            <p className="font-extrabold text-primary text-xs">{tenantInfo.unitNumber}</p>
            <p className="text-muted-foreground font-semibold">{tenantInfo.propertyAddress}</p>
          </div>
        </div>

        {/* COMPLETE TRANSACTION HISTORY TABLE */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-2">
            Complete Ledger Transaction Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[10px] font-extrabold uppercase text-muted-foreground bg-secondary/30">
                  <th className="p-3">Date</th>
                  <th className="p-3">Transaction Description</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Debit (+)</th>
                  <th className="p-3 text-right">Credit (-)</th>
                  <th className="p-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-semibold">
                {ledgerItems.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/15 transition">
                    <td className="p-3 whitespace-nowrap font-mono text-muted-foreground">{item.date}</td>
                    <td className="p-3 font-bold text-foreground">{item.description}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                        item.type === 'Payment' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-rose-400">
                      {item.debit > 0 ? `+$${item.debit.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      {item.credit > 0 ? `-$${item.credit.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-black text-foreground">
                      ${item.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATEMENT FOOTER */}
        <div className="pt-6 border-t flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
          <span>Official Document generated by {tenantInfo.companyName}</span>
          <span>Page 1 of 1</span>
        </div>

      </Card>
    </div>
  );
};

export default ProfessionalLedgerView;
