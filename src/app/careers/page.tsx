'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';
import Button from '@/components/Button';

export default function CareersPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto py-12 px-6 lg:py-24">
        <Link href="/" className="inline-flex items-center text-xs font-black  tracking-widest text-gray-400 hover:text-white transition-colors group mb-12">
           <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="text-center mb-24">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
               <Rocket size={32} />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black  tracking-tighter mb-6">Build the Future of <br/><span className="text-blue-500">Global Learning</span></h1>
            <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto">We are an elite team of engineers, designers, and educators actively scaling professional education pathways worldwide.</p>
        </div>

        <div className="space-y-6">
            <h3 className="text-xl font-black  tracking-widest text-gray-500 mb-8 border-b border-white/10 pb-4">Open Positions</h3>
            
            {[
                { title: 'Senior Frontend Engineer', dept: 'Engineering', loc: 'Remote (EMEA/US)', type: 'Full-time' },
                { title: 'Machine Learning Architect', dept: 'AI / Data', loc: 'Nairobi, Kenya', type: 'Full-time' },
                { title: 'Enterprise Account Executive', dept: 'Sales', loc: 'Remote', type: 'Full-time' },
                { title: 'Curriculum Strategist', dept: 'Education', loc: 'Remote', type: 'Contract' },
            ].map((job, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black  tracking-widest text-blue-400">{job.dept}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span className="text-[10px] font-black  tracking-widest text-gray-400">{job.type}</span>
                        </div>
                        <h4 className="text-2xl font-black tracking-tight">{job.title}</h4>
                        <p className="text-sm font-bold text-gray-500 mt-2">{job.loc}</p>
                    </div>
                    <Button className="h-12 px-8 rounded-xl font-black  tracking-widest bg-white text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        Apply Now
                    </Button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
