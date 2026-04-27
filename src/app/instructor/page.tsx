'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { 
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Sparkles,
  Cpu,
  ArrowUpRight,
  Layout,
  BarChart3
} from 'lucide-react';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({ total_courses: 0, total_students: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, userRes] = await Promise.all([
          api.get('/instructor/dashboard-stats'),
          api.get('/me')
        ]);
        setStats(statsRes.data);
        setUser(userRes.data);
      } catch {}
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Syncing intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8">
      {/* Header */}
      <div className="flex justify-between items-end gap-6 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 text-[8px] font-black uppercase tracking-widest">
              Intelligence dashboard
            </div>
            <span className="text-gray-400 font-bold text-[8px] uppercase tracking-widest">• Real-time engine active</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight mb-2 uppercase">
            Welcome back, <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent italic text-2xl sm:text-4xl font-black">Dr. {user?.first_name || 'Instructor'}</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed max-w-xl">
            Manage your curriculum and monitor real-time AI analytics.
          </p>
        </div>
        <Link href="/instructor/courses">
          <button className="flex items-center gap-3 px-6 py-3 bg-blue-950 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-blue-100 text-[9px] active:scale-95 uppercase tracking-widest shrink-0">
            <Plus size={14} className="text-blue-400" /> New module
          </button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-8 grid grid-cols-3 gap-5">
          <StatCard icon={BookOpen} label="Total Courses" value={stats.total_courses.toString()} badge="+2 this week" color="text-blue-600" />
          <StatCard icon={Users} label="Active Students" value={stats.total_students.toString()} badge="+12 new" color="text-indigo-600" />
          <StatCard icon={TrendingUp} label="Growth" value="$14.2k" badge="+5.2%" color="text-blue-600" />

          {/* Intelligence Feed */}
          <div className="col-span-3 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-500" size={12} />
                <h3 className="text-[9px] font-black text-gray-900 tracking-widest uppercase">Intelligence feed</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { student_name: 'D. Arkwright', query: 'Theoretical limits of neural caching?', time: '2m ago', course_title: 'AI Eng v2' },
                { student_name: 'S. Kholin', query: 'Optimization of async state loops?', time: '14m ago', course_title: 'Adv State' }
              ].map((q, i) => (
                <div key={i} className="flex gap-4 p-4 hover:bg-gray-50 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 font-black text-[10px] shadow-inner shrink-0 italic">
                    {q.student_name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-gray-900 text-[10px] uppercase">{q.student_name}</h4>
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">• {q.time}</span>
                    </div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic line-clamp-1 group-hover:line-clamp-none mb-2">"{q.query}"</p>
                    <span className="inline-block text-[7px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">{q.course_title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          {/* AI Studio Card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-100/20">
            <Cpu className="text-white/20 mb-4" size={18} />
            <h3 className="text-base font-black mb-2 uppercase tracking-widest italic">Transcription studio</h3>
            <p className="text-white/80 text-[8px] font-black uppercase tracking-widest mb-6 leading-relaxed max-w-[200px]">
              Refine and manage your AI-generated lesson transplants with high precision.
            </p>
            <Link href="/instructor/ai-generator">
              <button className="w-full h-10 bg-white text-blue-600 text-[9px] font-black rounded-lg shadow-xl hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                Open studio <ArrowUpRight size={12} />
              </button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layout size={12} className="text-blue-600" /> Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Curriculum', icon: <BookOpen size={12} />, href: '/instructor/courses' },
                { label: 'Students', icon: <Users size={12} />, href: '/instructor/students' },
                { label: 'Analytics', icon: <BarChart3 size={12} />, href: '/instructor/revenue' },
                { label: 'AI Studio', icon: <Cpu size={12} />, href: '/instructor/ai-generator' },
              ].map((item, i) => (
                <Link key={i} href={item.href}>
                  <div className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all group cursor-pointer border border-transparent hover:border-blue-100">
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors mb-2">{item.icon}</div>
                    <span className="text-[8px] font-black text-gray-500 group-hover:text-blue-600 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Task Log */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={12} className="text-blue-600" /> Progression Log
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Curriculum Audit', done: true },
                { label: 'AI Review Cycle', done: true },
                { label: 'Neural Integration', done: false }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${task.done ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${task.done ? 'text-gray-300 line-through' : 'text-gray-900'}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, badge, color }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={16} />
        </div>
        <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{badge}</span>
      </div>
      <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 uppercase">{value}</h4>
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
