'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Briefcase, 
  Users, 
  Percent, 
  ArrowUpRight, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function BusinessOverview() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/business/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load business stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 flex items-center justify-between">
        <div>
           <h1 className="text-5xl font-black text-gray-900  tracking-tighter mb-4">Workforce Analytics</h1>
           <p className="text-gray-500 font-medium italic">Aggregate training performance and compliance metrics across your organization.</p>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
           <ShieldCheck className="text-purple-600" size={18} />
           <span className="text-[10px] font-black  tracking-widest text-purple-900">Intelligence Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center sm:text-left">
        <StatCard 
          label="Total Workforce" 
          value={stats?.total_employees || 0} 
          icon={<Users size={24} />} 
          trend="+5.2%" 
          color="text-purple-600" 
          bg="bg-purple-50" 
        />
        <StatCard 
          label="Active Programs" 
          value={stats?.training_programs || 0} 
          icon={<Briefcase size={24} />} 
          trend="Static" 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          label="Organization Health" 
          value={`${stats?.completion_rate || 0}%`} 
          icon={<ShieldCheck size={24} />} 
          trend="+12%" 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
          isProgress
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Performance Chart Placeholder */}
         <div className="lg:col-span-2 bg-[#F5F3FF] border border-purple-100 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-12">
                  <div>
                     <h3 className="font-black text-gray-900  tracking-tight text-xl mb-2 flex items-center gap-3">
                        <BarChart3 className="text-purple-600" size={24} /> Training Volume
                     </h3>
                     <p className="text-xs text-gray-500 font-bold  tracking-widest leading-none">Weekly completion trends</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black  text-gray-400">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div> Completion
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black  text-gray-400">
                        <div className="w-2 h-2 bg-purple-200 rounded-full"></div> Enrollment
                     </div>
                  </div>
               </div>
               <div className="h-[350px] w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-purple-200 group-hover:border-purple-400 transition-all">
                  <p className="text-[10px] font-black text-purple-400  tracking-[0.3em] animate-pulse">Rendering Strategic Insights...</p>
               </div>
            </div>
         </div>

         {/* Activity Log */}
         <div className="lg:col-span-1 bg-white border border-gray-100 rounded-[3.5rem] p-12 shadow-sm">
            <h3 className="font-black text-gray-900  tracking-tight text-lg mb-10 flex items-center gap-3">
               <Clock className="text-blue-600" size={20} /> Operational Log
            </h3>
            <div className="space-y-8">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-5 group cursor-default">
                     <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 shadow-sm group-hover:shadow-purple-100 group-hover:rotate-12">
                        <CheckCircle2 size={20} />
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-snug">
                           Employee <span className="text-purple-600">ID #{100 + i * 23}</span> finished "Enterprise Cyber-Shield"
                        </p>
                        <p className="text-[10px] text-gray-400 font-black  tracking-widest mt-2">{i * 2}h ago</p>
                     </div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-12 py-5 bg-gray-50 hover:bg-purple-600 hover:text-white rounded-2xl text-[10px] font-black  tracking-[0.2em] transition-all">
               View Full Audit
            </button>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color, bg, isProgress }: any) {
  return (
    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-purple-100 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
         {icon}
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500  tracking-widest px-3 py-1 bg-emerald-50 rounded-full">
           <TrendingUp size={14} /> {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-gray-400  tracking-widest mb-2 italic">{label}</p>
      <h4 className="text-5xl font-black text-gray-900 tracking-tighter mb-6">{value}</h4>
      {isProgress && (
         <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[78%] rounded-full shadow-sm"></div>
         </div>
      )}
    </div>
  );
}
