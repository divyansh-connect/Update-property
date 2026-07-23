import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Printer, Download, Share2, Link as LinkIcon, X } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { Invoice } from '../../../types';

interface ItemizedInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onRecordPayment: () => void;
}

export const ItemizedInvoiceModal: React.FC<ItemizedInvoiceModalProps> = ({ isOpen, onClose, invoice, onRecordPayment }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 rounded-xl max-w-3xl w-full shadow-2xl relative my-8">
        
        {/* Action Bar (Not part of print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/80 rounded-t-xl print:hidden">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-2" /> Print
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold hidden sm:flex">
              <Download className="w-3.5 h-3.5 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold hidden sm:flex">
              <Share2 className="w-3.5 h-3.5 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold hidden sm:flex">
              <LinkIcon className="w-3.5 h-3.5 mr-2" /> Copy Link
            </Button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Body */}
        <div className="p-10 space-y-8 print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">APEX Property Management</h1>
                  <p className="text-xs font-medium text-slate-500">Professional Real Estate Solutions</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-200 tracking-widest uppercase mb-2">Invoice</h2>
              <div className="space-y-1 text-xs">
                <div className="flex justify-end gap-4">
                  <span className="font-semibold text-slate-400">Invoice No:</span>
                  <span className="font-bold text-slate-800">{invoice.id}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="font-semibold text-slate-400">Issue Date:</span>
                  <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="font-semibold text-slate-400">Due Date:</span>
                  <span className="font-bold text-slate-800">{invoice.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-b pb-8">
            {/* Bill To */}
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-2">Billed To</h3>
              <p className="text-lg font-bold text-slate-900">{invoice.tenantName}</p>
              <p className="text-sm font-medium text-slate-600">{invoice.propertyName} • Unit {invoice.unitNumber}</p>
              <p className="text-sm font-medium text-slate-500">tenant@example.com</p>
              <p className="text-sm font-medium text-slate-500">+1 (555) 000-0000</p>
            </div>
            <div>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-3 font-bold text-slate-900">Description</th>
                  <th className="py-3 font-bold text-slate-900 text-center">Qty</th>
                  <th className="py-3 font-bold text-slate-900 text-right">Rate</th>
                  <th className="py-3 font-bold text-slate-900 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50">
                    <td className="py-4 font-medium text-slate-800">{item.description}</td>
                    <td className="py-4 font-medium text-slate-600 text-center">1</td>
                    <td className="py-4 font-medium text-slate-600 text-right">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 font-bold text-slate-900 text-right">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Subtotal</span>
                <span>${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Discounts</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t-2 border-slate-900">
                <span>Total Due</span>
                <span>${invoice.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-16 border-t mt-16 text-xs text-slate-500 font-medium grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-700">Payment Instructions</h4>
              <p>Please remit payment by the due date to avoid a 5% late fee penalty. You can pay securely online via your Tenant Portal using ACH, Credit, or Debit card.</p>
              <p className="text-indigo-600 font-bold mt-2">Thank you for your business!</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-bold text-slate-700">APEX Property Management</p>
              <p>1234 Business Parkway, Suite 100</p>
              <p>San Francisco, CA 94111</p>
              <p>billing@apexmanagement.com</p>
              <p>(800) 555-APEX</p>
              <p className="text-indigo-600 font-semibold mt-2">www.apexmanagement.com</p>
            </div>
          </div>

        </div>

        {/* Bottom Actions (Not part of print) */}
        <div className="px-6 py-4 bg-slate-50 border-t rounded-b-xl flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>Close Document</Button>
          <Button onClick={onRecordPayment} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
            Record Payment
          </Button>
        </div>

      </div>
    </div>
  );
};
