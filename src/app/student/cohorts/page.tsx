'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  Layers, 
  ArrowRight, 
  Calendar, 
  Loader2,
  Bookmark,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/student/cohorts')
      .then(res => setCohorts(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="text-blue-600 animate-spin" size={32} />
      <p className="text-sm font-bold text-gray-400">Synchronizing cohorts...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="max-w-2xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black  tracking-[0.2em] rounded">
                 Social Learning
              </div>
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">Active cohorts</h1>
           <p className="text-sm font-medium text-gray-500 leading-relaxed">
             Join collective learning sessions and track your progress alongside peers in your assigned study groups.
           </p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <Users size={20} />
           </div>
           <div>
              <p className="text-xl font-bold text-gray-900 leading-none">{cohorts.length}</p>
              <p className="text-[10px] font-bold text-gray-400  tracking-widest mt-1">Total groups</p>
           </div>
        </div>
      </div>

      {/* Cohort Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cohorts.map((cohort) => (
          <div key={cohort.course_id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-gray-100/50 transition-all group flex flex-col justify-between">
             <div>
                <div className="flex items-center justify-between mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers size={28} />
                   </div>
                   <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 text-xs font-bold ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                           {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                         +12
                      </div>
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{cohort.group?.name || 'Class Alpha'}</h3>
                   <p className="text-xs font-bold text-gray-400  tracking-widest flex items-center gap-2">
                      Project: <span className="text-gray-900">{cohort.course_title}</span>
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <p className="text-[10px] font-bold text-gray-400  tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                         <ShieldCheck size={14} /> Active
                      </div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <p className="text-[10px] font-bold text-gray-400  tracking-widest mb-1">Session ID</p>
                      <p className="text-blue-600 font-bold text-sm font-sans truncate">#VD-942{cohort.course_id}</p>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between gap-4 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400">
                   <Calendar size={14} />
                   <span className="text-xs font-bold">Since March 2026</span>
                </div>
                <Link href={`/student/learn/${cohort.course_id}`}>
                   <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200">
                      Enter workspace <ArrowRight size={14} />
                   </button>
                </Link>
             </div>
          </div>
        ))}

        {cohorts.length === 0 && (
          <div className="col-span-full py-24 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600">
              <UserPlus size={32} />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">No cohorts assigned</h4>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">Enroll in premium courses to be automatically assigned to the next learning cohort.</p>
            <Link href="/student/courses">
              <button className="px-10 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-100 hover:scale-105 transition-all">Enroll now</button>
            </Link>
          </div>
        )}
      </div>

      {/* Social Features Callout */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
         <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
               <h2 className="text-3xl font-black mb-4 tracking-tight leading-none">Collaborative learning engine</h2>
               <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-md opacity-80">
                  Join Discord study groups, share code snippets, and participate in peer-review cycles directly with your cohort members.
               </p>
            </div>
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-white text-blue-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/20 text-xs  tracking-widest">
                  Join Discord
               </button>
               <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xs  tracking-widest">
                  Resources
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
