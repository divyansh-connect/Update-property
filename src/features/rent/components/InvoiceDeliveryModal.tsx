import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Mail, MessageSquare, Send, CheckCircle2, X, RefreshCw, FileText } from 'lucide-react';

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
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const simulateSend = (msg: string) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStatusMsg(msg);
      setTimeout(() => {
        setStatusMsg('');
        onClose(); // Auto close after success
      }, 3000);
    }, 1200);
  };

  const handleSendEmail = () => {
    simulateSend(`Invoice #${invoiceData.id} sent successfully to ${invoiceData.tenantEmail}`);
  };

  const handleSendSMS = () => {
    simulateSend(`Invoice #${invoiceData.id} SMS dispatched to ${invoiceData.tenantPhone}`);
  };

  const handleWhatsApp = () => {
    const rawPhone = (invoiceData.tenantPhone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${invoiceData.tenantName},\nYour monthly invoice #${invoiceData.id} of $${invoiceData.amount.toFixed(2)} for ${invoiceData.propertyName} (Unit ${invoiceData.unitNumber}) is due on ${invoiceData.dueDate}.\n\nYou can pay directly online via your Tenant Portal.\nThank you!`
    );
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
    simulateSend(`WhatsApp conversation opened for ${invoiceData.tenantName}`);
  };

  const handleSendAll = () => {
    setIsSending(true);
    const rawPhone = (invoiceData.tenantPhone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${invoiceData.tenantName},\nYour monthly invoice #${invoiceData.id} of $${invoiceData.amount.toFixed(2)} for ${invoiceData.propertyName} (Unit ${invoiceData.unitNumber}) is due on ${invoiceData.dueDate}.\n\nYou can pay directly online via your Tenant Portal.\nThank you!`
    );
    // Open WhatsApp in background/new tab
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
    
    // Simulate the email and SMS sending delay
    setTimeout(() => {
      setIsSending(false);
      setStatusMsg(`Success! Invoice #${invoiceData.id} was dispatched via Email, SMS, and WhatsApp.`);
      setTimeout(() => {
        setStatusMsg('');
        onClose(); // Auto close after success
      }, 3500);
    }, 1500);
  };

  const previewMessage = `Hello ${invoiceData.tenantName},\nYour monthly invoice #${invoiceData.id} of $${invoiceData.amount.toFixed(2)} for ${invoiceData.propertyName} (Unit ${invoiceData.unitNumber}) is due on ${invoiceData.dueDate}. Please remit payment by the due date to avoid late fees.\n\nThank you for your business!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Document-style white container with soft shadow */}
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl shadow-2xl flex overflow-hidden relative">
        
        {/* Left Side: Invoice Summary / Preview panel */}
        <div className="w-1/3 bg-slate-50 border-r p-8 hidden md:block">
          <div className="flex items-center text-indigo-600 mb-6">
            <FileText className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-black tracking-tight">APEX</h3>
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Document Preview</h4>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Billed To</p>
              <p className="font-bold text-slate-800">{invoiceData.tenantName}</p>
              <p className="text-sm text-slate-500">{invoiceData.propertyName} • Unit {invoiceData.unitNumber}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Invoice Details</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-600">Reference:</span>
                <span className="font-mono text-sm font-semibold text-slate-800">{invoiceData.id}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-600">Due Date:</span>
                <span className="text-sm font-semibold text-slate-800">{invoiceData.dueDate}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Amount Due</p>
              <p className="text-3xl font-black text-indigo-600">${invoiceData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Delivery Settings */}
        <div className="flex-1 p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Deliver Invoice / Receipt</h2>
          <p className="text-sm text-slate-500 mb-8">Configure automated delivery settings or instantly dispatch this document manually.</p>

          {statusMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-3 animate-fade-in my-12">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-bold text-lg">{statusMsg}</p>
              <p className="text-sm text-emerald-600">This window will close automatically...</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              
              {/* Message Preview Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Message Preview</h3>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {previewMessage}
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Manual Dispatch Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleSendEmail} 
                    disabled={isSending}
                    className="h-auto py-3 flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 group"
                  >
                    <Mail className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-bold text-sm">Send Email</span>
                    <span className="text-[10px] text-slate-400 font-medium">{invoiceData.tenantEmail}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSendSMS}
                    disabled={isSending}
                    className="h-auto py-3 flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 group"
                  >
                    <MessageSquare className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-bold text-sm">Send SMS</span>
                    <span className="text-[10px] text-slate-400 font-medium">{invoiceData.tenantPhone}</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleWhatsApp} 
                    disabled={isSending}
                    className="h-auto py-3 flex flex-col items-center justify-center gap-2 border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700 shadow-sm shadow-emerald-200 group"
                  >
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span className="font-bold text-sm">WhatsApp</span>
                    <span className="text-[10px] text-emerald-100 font-medium">{invoiceData.tenantPhone}</span>
                  </Button>
                </div>
                
                {/* Send via All Channels Button */}
                <Button
                  onClick={handleSendAll}
                  disabled={isSending}
                  className="w-full mt-3 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="font-bold text-sm">Dispatch via All Channels</span>
                </Button>
              </div>

              {/* Automation Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Automated Monthly Delivery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" checked={autoEmail} onChange={(e) => setAutoEmail(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Auto-Email Invoices</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" checked={autoSMS} onChange={(e) => setAutoSMS(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Auto-SMS Invoices</span>
                  </label>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InvoiceDeliveryModal;
