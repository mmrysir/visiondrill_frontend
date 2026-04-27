'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-24">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-xs font-black  tracking-widest text-gray-400 hover:text-blue-600 transition-colors group mb-16">
           <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="space-y-16">
          {/* Mission Section */}
          <div className="text-center space-y-4 sm:mx-auto sm:max-w-xl lg:max-w-4xl">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 ">
                  Our Mission
              </h2>
              <p className="text-lg text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto  tracking-widest text-[10px]">
                  Build a world-class online interactive learning environment
              </p>
          </div>

          {/* Differentiation Section */}
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-16 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.1),transparent)]"></div>
              <div className="text-center space-y-6 sm:mx-auto sm:max-w-xl lg:max-w-4xl relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 ">
                      What Makes Us Different
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-l-4 border-blue-500 text-left">
                      <p className="text-sm font-bold text-gray-600 leading-relaxed">
                          We connect students with content through networks users build with their peers
                          and instructors. This is our biggest differentiator compared to traditional e-learning platforms that focus on one-time matching of students with content.
                      </p>
                  </div>
              </div>
          </div>

          {/* Press Coverage Section */}
          <div className="bg-gray-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
              <h2 className="text-3xl font-black tracking-tighter  mb-2">In the Press</h2>
              <p className="text-[10px] text-gray-400 font-black  tracking-widest mb-12">Featured in leading publications</p>
              
              <div className="grid gap-6 max-w-3xl mx-auto">
                  {[
                      { name: "Business Daily Africa", title: "The future of education as AI plugs into system", link: "#" },
                      { name: "Business Daily Africa", title: "Techie makes a name transforming learning", link: "#" },
                      { name: "Nation Africa", title: "Secrets to fast success", link: "#" },
                      { name: "Scholar Media Africa", title: "CEO Skills: A warrior's spear for youth employment", link: "#" }
                  ].map((press, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-left group cursor-pointer">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-black text-xs">
                              {i + 1}
                          </div>
                          <div className="flex-1">
                              <p className="text-[10px] text-gray-400 font-bold  tracking-widest mb-1">{press.name}</p>
                              <a href={press.link} target="_blank" rel="noreferrer" className="text-white font-bold group-hover:text-blue-400 transition-colors text-sm">
                                  {press.title}
                              </a>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
