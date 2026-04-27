'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { 
  PlayCircle, 
  Clock, 
  Award, 
  ArrowRight,
  TrendingUp,
  BookOpen,
  Search,
  X
} from 'lucide-react';
import CourseCard from '@/components/CourseCard';

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.get('/student/dashboard-stats'),
          api.get('/student/courses')
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data);
      } catch {
        setError('Network connection failed.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <X className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" onClick={() => setError(null)} />
          <p className="text-[9px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Continue Learning Block */}
      <div className="mb-10">
        <h1 className="text-xl font-black text-gray-900 tracking-tighter mb-6 uppercase tracking-widest italic">Continue learning</h1>
        <div className="grid grid-cols-3 gap-6 items-stretch">
          {/* Progress Card */}
          <div className="col-span-2 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100/10 flex items-center">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest leading-none">Weekly status</h2>
                  <p className="text-blue-100/60 text-[8px] font-black mt-1 uppercase tracking-widest">Goal: 10 Lessons</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-white rounded-full shadow-lg transition-all duration-1000"
                  style={{ width: `${Math.min((stats?.weekly_lessons_completed / 10) * 100, 100) || 5}%` }}
                />
              </div>
              <p className="text-white/80 text-[9px] font-black uppercase tracking-widest italic">
                {stats?.weekly_lessons_completed > 0 
                  ? `${stats.weekly_lessons_completed} lessons completed this week.` 
                  : 'Zero progress recorded this week.'}
              </p>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="flex flex-col gap-4 h-full">
            <StatMini icon={<Clock size={14} />} label="Learning time" value={`${stats?.hours_learned || 0}H`} color="text-blue-600" bg="bg-white" />
            <Link href="/student/wishlist">
              <StatMini icon={<Award size={14} />} label="Certificates" value={stats?.certificates_earned?.toString().padStart(2, '0') || '00'} color="text-indigo-600" bg="bg-white" className="h-full" />
            </Link>
          </div>
        </div>
      </div>

      {/* Enrollments Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-gray-900 tracking-widest flex items-center gap-2 uppercase">
            <BookOpen className="text-blue-600" size={16} /> Enrollments
          </h3>
          <Link href="/courses" className="text-[8px] font-black text-gray-400 hover:text-blue-600 transition-all flex items-center gap-2 uppercase tracking-widest">
            Library <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-2xl animate-pulse" />)}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-dashed border-gray-100 rounded-3xl">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
              <PlayCircle size={24} />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1 uppercase tracking-widest italic">No active courses</h4>
            <p className="text-[8px] font-black text-gray-400 mb-8 uppercase tracking-widest">Catalog exploration required.</p>
            <Link href="/courses">
              <button className="px-6 py-3 bg-blue-950 text-white font-black rounded-lg shadow-xl shadow-blue-100 active:scale-95 transition-all text-[9px] uppercase tracking-widest">Browse catalog</button>
            </Link>
          </div>
        )}
      </div>

      {/* Discovery */}
      <div className="grid grid-cols-3 gap-6 mb-20">
        <div className="col-span-2 bg-[#F8FAFC] border border-gray-100 rounded-3xl p-12 relative overflow-hidden group">
          <TrendingUp className="text-blue-600 mb-8" size={28} />
          <h3 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase italic">Recommended<br />paths</h3>
          <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-relaxed mb-10 max-w-sm italic">Synchronized with your current progression profile.</p>
          <Link href="/courses">
            <button className="px-6 py-3 bg-white text-blue-600 border border-gray-100 font-black rounded-xl shadow-sm transition-all flex items-center gap-3 text-[9px] uppercase tracking-widest">
              Discover Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="bg-gray-950 rounded-3xl p-12 text-white flex flex-col justify-between border border-white/5">
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-10">
              <Search className="text-blue-400" size={18} />
            </div>
            <h4 className="text-xl font-black mb-4 uppercase tracking-widest italic">Deep search</h4>
            <p className="text-gray-500 font-black text-[8px] uppercase tracking-widest leading-relaxed mb-10">Indexed across the global curriculum engine using advanced neural patterns.</p>
          </div>
          <input 
            type="text" 
            placeholder="Query curriculum..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-6 font-black text-[10px] text-white placeholder-gray-600 focus:bg-white/10 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, label, value, color, bg, className = '' }: any) {
  return (
    <div className={`p-6 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group cursor-default min-h-[140px] ${bg} ${className}`}>
      <div className={`${color} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <div className="text-xl font-black text-gray-900 tracking-widest mb-1 uppercase">{value}</div>
        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}
