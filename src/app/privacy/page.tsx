'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:py-24">
        <Link href="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors group mb-12">
           <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-xl border border-gray-100">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <ShieldCheck size={24} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Privacy Policy</h1>
           </div>
           
           <div className="prose prose-blue max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-500 prose-p:leading-relaxed">
              <p>Last updated: April 25, 2026</p>
              
              <h3>1. Information We Collect</h3>
              <p>When you use VisionDrill, we collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, and other information you choose to provide.</p>

              <h3>2. How We Use Information</h3>
              <p>We may use the information we collect about you to Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</p>

              <h3>3. Information Sharing And Disclosure</h3>
              <p>We do not share personal information about you except as described in this Privacy Policy. We may share personal information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
