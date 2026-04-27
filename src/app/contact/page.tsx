'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/components/Button';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-24">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-xs font-black  tracking-widest text-gray-400 hover:text-blue-600 transition-colors group mb-16">
           <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900  mb-4">
                  Get in Touch
              </h2>
              <p className="text-sm font-bold text-gray-500 mb-12">
                  Have questions about our platform, enterprise solutions, or need technical support? Our team is available 24/7.
              </p>

              <div className="space-y-8">
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Mail size={20} />
                      </div>
                      <div>
                          <p className="text-[10px] font-black  tracking-widest text-gray-400 mb-1">Email Support</p>
                          <p className="font-bold text-gray-900">support@visiondrill.com</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Phone size={20} />
                      </div>
                      <div>
                          <p className="text-[10px] font-black  tracking-widest text-gray-400 mb-1">Phone Inquiry</p>
                          <p className="font-bold text-gray-900">+254 700 000 000</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <MapPin size={20} />
                      </div>
                      <div>
                          <p className="text-[10px] font-black  tracking-widest text-gray-400 mb-1">Headquarters</p>
                          <p className="font-bold text-gray-900">Nairobi, Kenya</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 p-8 lg:p-12 border border-gray-100">
             <h3 className="text-2xl font-black text-gray-900  tracking-tighter mb-8">Send a Message</h3>
             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                   <label className="block text-[10px] font-black  tracking-widest text-gray-400 mb-2">Full Name</label>
                   <input type="text" className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-gray-300" placeholder="e.g. John Doe" />
                </div>
                <div>
                   <label className="block text-[10px] font-black  tracking-widest text-gray-400 mb-2">Email Address</label>
                   <input type="email" className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-gray-300" placeholder="name@example.com" />
                </div>
                <div>
                   <label className="block text-[10px] font-black  tracking-widest text-gray-400 mb-2">Message</label>
                   <textarea rows={4} className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-gray-300 resize-none" placeholder="Your inquiry..."></textarea>
                </div>
                <Button className="w-full h-14 rounded-xl  tracking-widest text-xs font-black">
                   Send Inquiry
                </Button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
