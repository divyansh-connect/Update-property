import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { CreditCard, Building2, CheckCircle2, ArrowRight, X, Loader2, ShieldCheck } from 'lucide-react';

interface InteractivePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentAmount?: number;
  onPaymentSuccess?: (method: string, amount: number) => Promise<void> | void;
}

export const InteractivePaymentModal: React.FC<InteractivePaymentModalProps> = ({
  isOpen,
  onClose,
  rentAmount = 1400.00,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentAmount, setPaymentAmount] = useState(rentAmount.toString());
  const [method, setMethod] = useState<'card' | 'ach'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState('');

  // Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPaymentAmount(rentAmount.toString());
      setMethod('card');
      setOtp('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setRoutingNumber('');
      setAccountNumber('');
    }
  }, [isOpen, rentAmount]);

  if (!isOpen) return null;

  const parsedAmount = parseFloat(paymentAmount) || 0;
  const fee = method === 'card' ? parsedAmount * 0.029 : 0; // standard 2.9%
  const totalAmount = parsedAmount + fee;

  const handleProceedToOtp = () => {
    if (parsedAmount <= 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2); // Go to OTP step
    }, 800);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return;
    setIsSubmitting(true);
    try {
      if (onPaymentSuccess) {
        await onPaymentSuccess(method, parsedAmount);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setStep(3); // Success screen
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      console.error('Payment failed', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-card border border-border text-card-foreground rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        {!isSubmitting && step !== 3 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: Payment Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-black">Submit Rent Payment</h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Securely pay your rent online via ACH or Credit Card.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Payment Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground font-bold">$</span>
                  </div>
                  <Input 
                    type="number" 
                    className="pl-8 text-lg font-black"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                      method === 'card'
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                        : 'border-border hover:bg-secondary/40 text-muted-foreground'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-primary' : ''}`} />
                    <div>
                      <h4 className="font-black text-sm">Card</h4>
                      <p className="text-[10px] font-semibold opacity-80">2.9% Fee</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('ach')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                      method === 'ach'
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                        : 'border-border hover:bg-secondary/40 text-muted-foreground'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${method === 'ach' ? 'text-primary' : ''}`} />
                    <div>
                      <h4 className="font-black text-sm">ACH</h4>
                      <p className="text-[10px] font-semibold opacity-80">Free</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Entry Fields based on Method */}
              <div className="pt-2 animate-fade-in space-y-3">
                {method === 'card' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Card Number</label>
                      <Input 
                        placeholder="0000 0000 0000 0000" 
                        autoComplete="cc-number"
                        name="cc-number"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Expiry (MM/YY)</label>
                        <Input 
                          placeholder="MM/YY" 
                          autoComplete="cc-exp"
                          name="cc-exp"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">CVV</label>
                        <Input 
                          placeholder="123" 
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          name="cc-csc"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Routing Number</label>
                      <Input 
                        placeholder="9 Digit Routing Number" 
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
                      <Input 
                        placeholder="Bank Account Number" 
                        type="password"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="bg-secondary/20 border border-border p-4 rounded-xl space-y-2 text-xs mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>${parsedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className={fee > 0 ? 'text-amber-500' : 'text-emerald-500'}>
                    {fee > 0 ? `+$${fee.toFixed(2)}` : '$0.00 (Free)'}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-border">
                  <span>Total to Pay:</span>
                  <span className="text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full text-base py-6 font-bold" 
              onClick={handleProceedToOtp}
              disabled={isSubmitting || parsedAmount <= 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Securing Connection...
                </>
              ) : (
                <>
                  Proceed to Verification
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in text-center py-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-black">Security Verification</h2>
              <p className="text-xs text-muted-foreground font-medium mt-2">
                We've sent a One-Time Password (OTP) to your registered phone number to verify this transaction.
              </p>
            </div>

            <div className="space-y-2 max-w-[200px] mx-auto">
              <Input 
                type="text" 
                placeholder="Enter OTP (e.g. 1234)" 
                className="text-center text-lg font-bold tracking-widest"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <Button 
              className="w-full text-base py-6 font-bold" 
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.length < 4}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Pay ${totalAmount.toFixed(2)}
                </>
              )}
            </Button>
            <button 
              onClick={() => setStep(1)} 
              className="text-xs font-bold text-muted-foreground hover:text-foreground mt-4 block mx-auto"
            >
              Cancel & Go Back
            </button>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Payment Successful</h2>
            <p className="text-muted-foreground font-semibold">
              ${totalAmount.toFixed(2)} has been securely processed and applied to your ledger.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
