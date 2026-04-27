'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  User,
  Shield, 
  MessageSquare, 
  Search, 
  ArrowRight,
  Target,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await api.get('/student/cohorts');
        setCohorts(res.data || []);
      } catch (err) {
        console.error('Failed to load cohorts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  const filteredCohorts = cohorts.filter(cohort => 
    cohort.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cohort.group?.group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 animate-pulse space-y-12">
        <div className="h-40 bg-gray-50 rounded-3xl w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[1,2].map(i => <div key={i} className="h-96 bg-gray-50 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pb-32">
      
      {/* Header section */}
      <div className="mb-12">
         <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                     Study Collectives
                  </div>
                  <span className="text-gray-400 font-bold text-xs">• Active in {cohorts.length} cohorts</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight mb-8">
                 Group <br />
                 <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent italic">Momentum.</span>
               </h1>
            </div>
            
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
               <input 
                  type="text" 
                  placeholder="Find a cohort or peer..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-xl focus:border-indigo-200 outline-none font-bold text-sm text-gray-900 transition-all shadow-sm"
               />
            </div>
         </div>
      </div>

      {filteredCohorts.length > 0 ? (
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {filteredCohorts.map((cohort) => (
               <div key={cohort.course_id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group">
                  <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6 bg-gray-50/30">
                     <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Curriculum Cohort</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight capitalize">{cohort.course_title}</h3>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                           <span className="text-[10px] font-black text-gray-400 uppercase block leading-none mb-1">Group ID</span>
                           <span className="text-xs font-black text-gray-900">#{cohort.group.group.id}</span>
                        </div>
                        <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                           <MessageSquare size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="p-8">
                     <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Members ({cohort.group.members.length})</h4>
                        <div className="h-px bg-gray-100 flex-1 mx-6"></div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cohort.group.members.map((member: any) => (
                           <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group/member">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-indigo-600 shadow-sm">
                                    {member.student?.first_name?.[0] || 'U'}
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">
                                      {member.student?.first_name} {member.student?.last_name}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">Student</p>
                                 </div>
                              </div>
                              {member.is_leader && (
                                 <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg" title="Group Leader">
                                    <Shield size={14} />
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 pt-0 flex justify-end">
                     <Link href={`/student/courses/${cohort.course_title.toLowerCase().replace(/ /g, '-')}/continue`}>
                        <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                           Enter Study Environment <ArrowRight size={14} />
                        </button>
                     </Link>
                  </div>
               </div>
            ))}
         </div>
      ) : (
         <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 bg-indigo-100 rounded-[2.5rem] rotate-6 animate-pulse"></div>
               <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] -rotate-3 flex items-center justify-center text-white shadow-xl">
                  <Users2 size={48} />
               </div>
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">No Cohorts Yet</h2>
               <p className="text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
                  When you enroll in a course, you'll be automatically assigned to a cohort of peers to accelerate your learning momentum.
               </p>
            </div>
            <div className="pt-8">
               <Link href="/courses">
                  <button className="px-12 py-5 bg-gray-900 text-white font-black rounded-xl tracking-widest uppercase shadow-2xl shadow-gray-200 hover:bg-black transition-all">
                     Join a Study Collective
                  </button>
               </Link>
            </div>
         </div>
      )}
    </div>
  );
}
