'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { X, Phone, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';

interface PaymentModalProps {
  courseId: number;
  courseTitle: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ courseId, courseTitle, price, onClose, onSuccess }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'input' | 'pending' | 'success' | 'error'>('input');
  const [error, setError] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple Kenyan phone validation
    const phoneRegex = /^(?:\+?254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid M-Pesa number (e.g., 0712345678)');
      return;
    }

    setStep('pending');
    try {
      const res = await api.post('/mpesa/course-purchase', {
        course_id: courseId,
        phone: phoneNumber
      });
      setCheckoutRequestId(res.data.checkout_request_id);
      
      // In a real app, we would poll the status here. 
      // For this MVP, we'll simulate a successful push sent.
      // After 5 seconds, we'll provide a "Verify" button.
    } catch (err: any) {
      setStep('error');
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handleVerify = async () => {
     // In a real app, check /api/mpesa/status/{checkoutRequestId}
     // simulate success for demo
     setStep('success');
     setTimeout(() => {
        onSuccess();
        onClose();
     }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <img src="/images/mpesa-logo.png" className="w-8 h-8 object-contain" alt="M-Pesa" />
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
             <X size={20} />
           </button>
        </div>

        <div className="px-8 pb-10">
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Enroll in Course</h3>
                <p className="text-sm font-medium text-gray-400 mt-1 truncate">{courseTitle}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total to Pay</span>
                 <span className="text-xl font-black text-blue-600">${(price / 100).toFixed(2)}</span>
              </div>

              <form onSubmit={handleInitiate} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">M-Pesa Phone Number</label>
                   <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="text" 
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="0712345678"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl font-bold focus:ring-4 focus:ring-green-50 focus:border-green-400 outline-none transition-all"
                      />
                   </div>
                   {error && <p className="text-[10px] font-bold text-red-500 mt-2 ml-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
                </div>

                <Button type="submit" className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-100">
                   Pay with M-Pesa
                </Button>
                
                <p className="text-[9px] text-gray-400 text-center font-medium leading-relaxed">
                   By clicking pay, you will receive an STK push notification on your phone. <br/>
                   <span className="flex items-center justify-center gap-1 mt-2 text-green-600"> <ShieldCheck size={10} /> Secure SSL Encrypted Transaction</span>
                </p>
              </form>
            </div>
          )}

          {step === 'pending' && (
            <div className="py-10 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                 <div className="absolute inset-0 bg-green-100 blur-2xl opacity-50 animate-pulse"></div>
                 <Loader2 size={80} className="text-green-600 animate-spin relative z-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Awaiting Payment</h3>
                <p className="text-sm font-medium text-gray-400 mt-2">Please check your phone and enter your M-Pesa PIN to complete the enrollment.</p>
              </div>
              <Button onClick={handleVerify} className="w-full h-14 bg-gray-900 hover:bg-black text-white">I have paid</Button>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center space-y-6 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-50">
                  <CheckCircle2 size={64} />
               </div>
               <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Successful!</h3>
                <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">Welcome to the course</p>
               </div>
               <p className="text-xs text-gray-400">Redirecting you to the classroom...</p>
            </div>
          )}

          {step === 'error' && (
            <div className="py-10 text-center space-y-6">
               <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={64} />
               </div>
               <div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Payment Failed</h3>
                <p className="text-sm font-medium text-red-400 mt-2">{error}</p>
               </div>
               <Button onClick={() => setStep('input')} className="w-full h-14 border border-gray-100 bg-white text-gray-900">Try Again</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
