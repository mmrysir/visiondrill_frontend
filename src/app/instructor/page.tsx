'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Play, 
  BarChart3, 
  Plus, 
  MoreVertical, 
  Star,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Wallet,
  Clock
} from 'lucide-react';

export default function InstructorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, coursesRes, statsRes] = await Promise.all([
           api.get('/me'),
           api.get('/instructor/courses'),
           api.get('/instructor/dashboard-stats')
        ]);
        setUser(meRes.data);
        setCourses(coursesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* 1. Center Column: Operations Hub */}
      <div className="flex-1 min-w-0 space-y-10">
        
        {/* Command Search */}
        <div className="flex items-center gap-4">
           <div className="flex-1 relative group">
              <Plus className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                placeholder="Initialize new curriculum..." 
                className="w-full bg-white border border-gray-100 rounded-[2rem] pl-16 pr-6 py-4 text-sm font-medium focus:border-blue-200 outline-none transition-all shadow-sm shadow-gray-50"
              />
           </div>
           <button className="bg-blue-600 text-white p-4 rounded-[1.2rem] shadow-lg shadow-blue-100 hover:scale-105 transition-all active:scale-95">
              <Plus size={20} />
           </button>
        </div>

        {/* Executive Hero */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                 <p className="text-[9px] font-black  tracking-[0.3em] mb-3 text-blue-400">Command Center</p>
                 <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6">
                    Manage your curriculum throughput
                 </h1>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-[10px] font-black rounded-full hover:bg-blue-700 transition-all  tracking-widest">
                       Quick publish <Zap size={14} fill="white" />
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white text-[10px] font-black rounded-full hover:bg-white/20 transition-all  tracking-widest backdrop-blur-md border border-white/5">
                       View analytics
                    </button>
                 </div>
              </div>
              
              <div className="flex gap-10">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-500  tracking-widest mb-1">Impact</p>
                    <p className="text-3xl font-black font-sans">{stats?.total_students || '0'}</p>
                    <p className="text-[9px] text-emerald-400 font-bold mt-1">Total assets</p>
                 </div>
                 <div className="w-[1px] h-12 bg-white/10 mt-2" />
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-500  tracking-widest mb-1">Revenue</p>
                    <p className="text-3xl font-black font-sans">{stats?.total_earnings || '0'}</p>
                    <p className="text-[9px] text-blue-400 font-bold mt-1">KES total</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Intelligence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <IntelCard label="Average rating" value={stats?.average_rating} icon={<Star size={18} fill="currentColor" />} trend="+0.2" color="text-amber-500" />
           <IntelCard label="Course assets" value={courses.length} icon={<Zap size={18} />} trend="Active" color="text-blue-500" />
           <IntelCard label="Global Rank" value="#12" icon={<Globe size={18} />} trend="Top 1%" color="text-indigo-500" />
        </div>

        {/* Active Curriculum Assets */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Active course assets</h3>
              <Link href="/instructor/courses" className="text-blue-600 text-[10px] font-black  tracking-widest hover:underline">View fleet</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.slice(0, 4).map((course) => (
                <div key={course.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 flex gap-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all group">
                   <div className="w-24 h-24 rounded-3xl bg-gray-100 relative overflow-hidden shrink-0 shadow-inner">
                      <Image src={course.image || '/course-placeholder.jpg'} alt={course.course_title} fill className="object-cover" />
                   </div>
                   <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                         <div className="flex items-center justify-between mb-2">
                           <span className={`text-[9px] font-black px-3 py-1 rounded-lg  tracking-widest ${
                             course.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                           }`}>
                             {course.status}
                           </span>
                           <MoreVertical size={16} className="text-gray-200" />
                         </div>
                         <h4 className="text-sm font-black text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                           {course.course_title}
                         </h4>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 font-sans">142 students</span>
                         </div>
                         <p className="text-sm font-black text-gray-900 font-sans">KES {course.price}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* 2. Right Column: System Performance */}
      <aside className="w-full lg:w-80 xl:w-96 space-y-10 shrink-0">
          
          {/* Executive Profile */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                   <div className="w-28 h-28 rounded-full border-4 border-gray-50 flex items-center justify-center p-2">
                      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100">
                         {user?.first_name?.[0]}
                      </div>
                   </div>
                   <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" />
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">Welcome back, {user?.first_name}</h3>
                <p className="text-[10px] font-bold text-gray-400  tracking-widest mt-2">{user?.role === 'instructor' ? 'Executive Instructor' : 'System Operator'}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                   <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-lg font-black font-sans text-gray-900">{stats?.total_students || 0}</p>
                      <p className="text-[9px] font-bold text-gray-400  tracking-widest mt-1">Students</p>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-lg font-black font-sans text-gray-900">{courses.length}</p>
                      <p className="text-[9px] font-bold text-gray-400  tracking-widest mt-1">Active nodes</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Revenue Velocity Graph Strip */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-gray-900  tracking-widest">Revenue velocity</h4>
                <TrendingUp size={16} className="text-emerald-500" />
             </div>
             <div className="flex items-end justify-between gap-2 h-32">
                {[30, 45, 35, 70, 60, 90, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-50 rounded-t-lg group relative cursor-pointer flex flex-col justify-end overflow-hidden">
                     <div className="w-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  </div>
                ))}
             </div>
             <p className="text-[10px] text-center text-gray-400 font-bold mt-6">Week-over-week performance index</p>
          </div>

          {/* Recent Enrollments Assets */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
             <h4 className="text-sm font-black text-gray-900  tracking-widest mb-2">Student activity</h4>
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 transition-all rounded-2xl -mx-2 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                     <Users size={18} />
                  </div>
                  <div className="min-w-0">
                     <p className="text-xs font-black text-gray-900 truncate tracking-tight">New enrollment recorded</p>
                     <p className="text-[9px] text-gray-400 font-bold  mt-0.5">2 minutes ago</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-gray-200 group-hover:text-blue-600 transition-colors" />
               </div>
             ))}
             <button className="w-full py-4 bg-gray-50 text-blue-600 text-[10px] font-black  tracking-widest rounded-2xl hover:bg-blue-50 transition-all mt-4">
                View audit logs
             </button>
          </div>
      </aside>
    </div>
  );
}

function IntelCard({ label, value, icon, trend, color }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gray-50 ${color} flex items-center justify-center shadow-inner`}>
             {icon}
          </div>
          <div>
             <p className="text-[9px] font-black text-gray-400  tracking-widest mb-1">{label}</p>
             <p className="text-xl font-black text-gray-900 font-sans">{value}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-[9px] font-black text-emerald-500">{trend}</p>
       </div>
    </div>
  );
}
