'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:py-24">
        <Link href="/" className="inline-flex items-center text-xs font-black  tracking-widest text-gray-400 hover:text-blue-600 transition-colors group mb-12">
           <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-xl border border-gray-100">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Lock size={24} />
              </div>
              <h1 className="text-4xl font-black text-gray-900  tracking-tighter">Security Center</h1>
           </div>
           
           <div className="prose prose-blue max-w-none prose-headings:font-black prose-headings: prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:font-medium prose-p:text-gray-500 prose-p:leading-relaxed">
              <p>At VisionDrill, the security of our educators, students, and enterprise partners is our foundational priority.</p>
              
              <h3>1. Data Encryption</h3>
              <p>All data in transit is encrypted using bank-grade TLS 1.3 cryptography. Data at rest is secured using AES-256 encryption within isolated VPC shards ensuring tenant data logic remains decoupled and impenetrable.</p>

              <h3>2. Infrastructure Safety</h3>
              <p>We deploy continuous vulnerability assessments and utilize Next-Gen Web Application Firewalls (WAF) to intercept any malicious payloads in real-time before they touch our core application nodes.</p>

              <h3>3. Role-Based Access Control (RBAC)</h3>
              <p>Access privileges strictly adhere to the principle of least privilege. Instructors, students, and enterprise managers operate under mathematically sandboxed environments utilizing Class Table Inheritance modeling to ensure horizontal permission scaling without overlaps.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
