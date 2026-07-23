import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CurrencyInput } from '../../components/Phase4Components';
import { Loader2, ArrowLeft, Search, Check } from 'lucide-react';
import { clsx } from 'clsx';

import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { CashReceiptModal } from './components/CashReceiptModal';

const payFormSchema = zod.object({
  tenantId: zod.string().min(1, 'Tenant is required'),
  amount: zod.number().min(1, 'Amount must be positive'),
  dueDate: zod.string().min(1, 'Due Date is required'),
  paidDate: zod.string().min(1, 'Payment Date is required'),
  paymentMethod: zod.enum(['ACH', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'Money Order']),
  referenceNumber: zod.string().optional(),
  
  allocRent: zod.number().min(0),
  allocUtilities: zod.number().min(0),
  allocParking: zod.number().min(0),
  allocPet: zod.number().min(0),
  notes: zod.string().optional(),
});

type PayFormInputs = zod.infer<typeof payFormSchema>;

export const NewPaymentPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState(700);
  const [isCashReceiptOpen, setIsCashReceiptOpen] = useState(false);
  const [cashReceiptData, setCashReceiptData] = useState<any>(null);

  // Queries
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<PayFormInputs>({
    resolver: zodResolver(payFormSchema),
    defaultValues: {
      amount: 1500,
      paymentMethod: 'ACH',
      paidDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      allocRent: 1400,
      allocUtilities: 100,
      allocParking: 0,
      allocPet: 0,
    },
  });

  const selectedTenantId = watch('tenantId');
  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const selectedUnit = selectedTenant ? units.find((u) => u.id === selectedTenant.unitId) : null;

  const recordMutation = useMutation({
    mutationFn: (values: PayFormInputs) => {
      return api.payments.create({
        tenantId: values.tenantId,
        tenantName: selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : 'Tenant',
        propertyId: selectedUnit ? selectedUnit.propertyId : 'prop-1',
        propertyName: selectedUnit ? selectedUnit.propertyName : 'Property',
        unitId: selectedUnit ? selectedUnit.id : 'unit-1',
        unitNumber: selectedUnit ? selectedUnit.unitNumber : '101',
        amount: values.amount,
        dueDate: values.dueDate,
        paidDate: values.paidDate,
        paymentMethod: values.paymentMethod,
        referenceNumber: values.referenceNumber || `MAN-${Date.now()}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/manager/payments' }), 2000);
    },
  });

  const onSubmit = (values: PayFormInputs) => {
    const finalAmount = paymentType === 'full' ? values.amount : partialAmount;
    const finalPayload = { ...values, amount: finalAmount };

    if (values.paymentMethod === 'Cash') {
      const data = {
        receiptNumber: `CSH-${Date.now().toString().slice(-6)}`,
        tenantName: selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : 'Tenant',
        tenantPhone: selectedTenant?.phone || '+1 (555) 234-5678',
        tenantEmail: selectedTenant?.email || 'tenant@skyline.com',
        propertyName: selectedUnit ? selectedUnit.propertyName : 'Skyline Heights',
        unitNumber: selectedUnit ? selectedUnit.unitNumber : '101',
        amountPaid: finalAmount,
        paymentDate: values.paidDate,
        receivedBy: 'Office Collection Manager',
        notes: values.notes || 'Cash Rent Deposit',
      };
      setCashReceiptData(data);
      setIsCashReceiptOpen(true);
    }
    recordMutation.mutate(finalPayload);
  };

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsTenantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTenants = tenants.filter((t) => {
    const term = tenantSearchQuery.toLowerCase();
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    const unit = (t.unitNumber || '').toLowerCase();
    const email = (t.email || '').toLowerCase();
    const phone = (t.phone || '').toLowerCase();
    return fullName.includes(term) || unit.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Record Payment Receipt"
        description="Log offline checks, cash, or credit transactions directly into the tenant ledger."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Payments', href: '/payments' },
          { label: 'Record Payment' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          Payment logged successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        
        {/* --- SECTION 1: TENANT SELECT --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Tenant Account</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 relative" ref={comboboxRef}>
              <label className="text-xs font-bold text-muted-foreground uppercase">Tenant</label>
              
              <Controller
                name="tenantId"
                control={control}
                defaultValue={watch('tenantId')}
                render={({ field }) => {
                  const selectedT = tenants.find((t) => t.id === field.value);
                  return (
                    <div>
                      <div 
                        className="flex items-center border border-border rounded-lg px-3 py-2 bg-background cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                      >
                        <Search className="w-4 h-4 text-muted-foreground mr-2" />
                        <span className={clsx("flex-1 text-sm font-semibold truncate", !selectedT && "text-muted-foreground")}>
                          {selectedT ? `${selectedT.firstName} ${selectedT.lastName} (Unit ${selectedT.unitNumber})` : "Search Tenant by Name, Unit, or Email..."}
                        </span>
                      </div>
                      
                      {isTenantDropdownOpen && (
                        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-[400px] bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
                          <div className="p-2 border-b border-border bg-muted/20">
                            <input
                              autoFocus
                              className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Type to filter tenants..."
                              value={tenantSearchQuery}
                              onChange={(e) => setTenantSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-1">
                            {filteredTenants.length === 0 ? (
                              <div className="p-4 text-center text-sm font-semibold text-muted-foreground">
                                No tenant found. Try another name or unit number.
                              </div>
                            ) : (
                              filteredTenants.map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => {
                                    setValue('tenantId', t.id);
                                    setIsTenantDropdownOpen(false);
                                    setTenantSearchQuery('');
                                  }}
                                  className={clsx(
                                    "flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                                    field.value === t.id && "bg-primary/5"
                                  )}
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mr-3">
                                    {t.firstName[0]}{t.lastName[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-foreground">{t.firstName} {t.lastName}</div>
                                    <div className="text-[10px] font-semibold text-muted-foreground truncate">
                                      Unit {t.unitNumber || 'N/A'} • {t.propertyName || 'Property'}
                                    </div>
                                  </div>
                                  {field.value === t.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {errors.tenantId && <p className="text-rose-500 text-xs">{errors.tenantId.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Unit Location</label>
              <Input
                value={selectedUnit ? `${selectedUnit.propertyName} • Unit ${selectedUnit.unitNumber}` : 'Unassigned'}
                disabled
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: PAYMENT TYPE & DETAILS --- */}
        <PaymentTypeSelector
          totalDue={watch('amount') || 1400}
          paymentType={paymentType}
          partialAmount={partialAmount}
          onPaymentTypeChange={setPaymentType}
          onPartialAmountChange={setPartialAmount}
        />

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Payment Parameters</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Payment Amount ($)"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Channel</label>
              <Select {...register('paymentMethod')}>
                <option value="ACH">ACH Direct</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Wire</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
                <option value="Money Order">Money Order</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Date</label>
              <Input type="date" {...register('paidDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Due Date Reference</label>
              <Input type="date" {...register('dueDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Reference Number</label>
              <Input placeholder="Check # / Wire ID" {...register('referenceNumber')} />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ALLOCATIONS --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Billing Allocations</h3>
          <div className="grid grid-cols-4 gap-4">
            <CurrencyInput label="Rent ($)" {...register('allocRent', { valueAsNumber: true })} />
            <CurrencyInput label="Utilities ($)" {...register('allocUtilities', { valueAsNumber: true })} />
            <CurrencyInput label="Parking ($)" {...register('allocParking', { valueAsNumber: true })} />
            <CurrencyInput label="Pet Fee ($)" {...register('allocPet', { valueAsNumber: true })} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Transaction Notes</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
            placeholder="Add receipt notes..."
            {...register('notes')}
          />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: '/manager/payments' })} className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Button>
          <Button type="submit" disabled={recordMutation.isPending}>
            {recordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Record Payment Receipt
          </Button>
        </div>

      </form>

      <CashReceiptModal
        isOpen={isCashReceiptOpen}
        onClose={() => setIsCashReceiptOpen(false)}
        receiptData={cashReceiptData}
      />
    </div>
  );
};
export default NewPaymentPage;
