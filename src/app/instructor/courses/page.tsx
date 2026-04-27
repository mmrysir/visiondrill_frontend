'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  BookOpen, Users, Plus, Search, Filter, Layout, Trash2, Globe, Loader2, X, Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  slug: string;
  course_title: string;
  thumbnail: string | null;
  enrollments_count: number;
  price: number;
  status: string;
  category?: { name: string };
}

interface Stats {
  total_courses: number;
  total_students: number;
  published_count: number;
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ course_title: '', category_id: '', price: '' });
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesRes, statsRes] = await Promise.all([
        api.get('/instructor/courses'),
        api.get('/instructor/dashboard-stats'),
      ]);
      setCourses(coursesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Data fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/instructor/create-course', {
        ...createForm,
        price: createForm.price ? parseFloat(createForm.price) : 0
      });
      setCourses(prev => [res.data, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const filtered = courses.filter(c =>
    c.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black text-gray-400">Syncing library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                 <div className="px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-[9px] font-black">
                    Content library
                 </div>
                 <span className="text-gray-500 font-bold text-[10px]">• {courses.length} Modules</span>
              </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[0.95] tracking-tight mb-3">
               Manage your <br />
               <span className="bg-gradient-to-r from-cyan-600 to-teal-400 bg-clip-text text-transparent italic text-2xl lg:text-3xl">Instructional assets.</span>
            </h1>
            <p className="text-base text-gray-400 font-medium leading-relaxed max-w-lg mb-4">
               Build high-impact courses and track enrollment from your architect interface.
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-cyan-950 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-cyan-100 text-[10px] active:scale-95 mb-4"
          >
            <Plus size={16} className="text-cyan-400" /> Create module
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookOpen} label="Total assets" value={(stats?.total_courses ?? 0).toString()} badge="Curriculum" color="text-cyan-600" />
        <StatCard icon={Users} label="Active students" value={(stats?.total_students ?? 0).toString()} badge="Engagement" color="text-teal-600" />
        <StatCard icon={Globe} label="Live modules" value={(stats?.published_count ?? 0).toString()} badge="Marketplace" color="text-cyan-600" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
         <div className="relative flex-grow max-w-2xl w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
               type="text"
               placeholder="Search..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-3.5 bg-white border border-gray-100 rounded-xl focus:ring-8 focus:ring-cyan-50 focus:border-cyan-200 outline-none font-bold text-gray-900 transition-all shadow-sm text-xs"
            />
         </div>
         <div className="flex items-center gap-3">
            <button className="h-11 w-11 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-cyan-600 hover:border-cyan-100 transition-all shadow-sm">
               <Filter size={16} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
         {filtered.map(course => (
            <div key={course.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
               <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {course.thumbnail ? (
                     <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <BookOpen size={48} className="text-gray-200" />
                     </div>
                  )}
               </div>
               <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 tracking-tighter mb-4 line-clamp-2 min-h-[3rem] group-hover:text-cyan-600 transition-colors">
                     {course.course_title}
                  </h3>
                  <div className="flex items-center gap-3">
                     <Link href={`/instructor/courses/${course.id}/curriculum`} className="flex-grow">
                        <button className="w-full h-14 bg-cyan-950 text-white font-black rounded-2xl text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2">
                           <Layout size={16} /> Edit architect
                        </button>
                     </Link>
                     <button className="h-14 w-14 bg-white border border-gray-100 text-gray-300 hover:text-red-600 rounded-2xl flex items-center justify-center transition-all">
                        <Trash2 size={20} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-12 relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-gray-400">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-8">New asset</h2>
            <form onSubmit={handleCreate} className="space-y-6">
               <input
                  required
                  placeholder="Module title..."
                  value={createForm.course_title}
                  onChange={e => setCreateForm({ ...createForm, course_title: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:ring-8 focus:ring-cyan-50"
               />
               <button type="submit" disabled={creating} className="w-full py-5 bg-cyan-950 text-white font-black rounded-xl text-xs hover:bg-black flex items-center justify-center gap-3 active:scale-95">
                  {creating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} Initiate production
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, badge, color }: any) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all group min-h-[120px] flex flex-col justify-between">
       <div>
          <div className="flex items-center justify-between mb-4">
             <div className={`${color}`}><Icon size={18} /></div>
             <span className={`text-[9px] font-black ${color}`}>{badge}</span>
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tighter mb-0.5">{value}</div>
       </div>
       <p className="text-[9px] font-black text-gray-400">{label}</p>
    </div>
  );
}
