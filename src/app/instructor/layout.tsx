'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import BrandLogo from '@/components/BrandLogo';
import { api } from '@/lib/api';
import { 
  Users, 
  Layout, 
  Settings, 
  BarChart3, 
  LogOut, 
  PlusCircle, 
  Zap,
  Search
} from 'lucide-react';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    api.get('/me').then(res => setUser(res.data)).catch(() => window.location.replace('/login'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch {}
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      <Toaster />
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-1 bg-white/90 backdrop-blur-2xl shadow-sm border-b border-blue-50' : 'py-2 bg-white/50'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <BrandLogo subtitle="Instructor console" />
            <div className="flex items-center gap-1 bg-gray-100/30 p-1 rounded-xl border border-gray-100/50">
              <NavLink href="/instructor" icon={<Layout size={10} />} label="Overview" />
              <NavLink href="/instructor/courses" icon={<PlusCircle size={10} />} label="Curriculum" />
              <NavLink href="/instructor/students" icon={<Users size={10} />} label="Learners" />
              <NavLink href="/instructor/revenue" icon={<BarChart3 size={10} />} label="Finance" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center relative w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={10} />
              </div>
              <input 
                type="text" 
                placeholder="Scan..." 
                className="w-full bg-gray-100/30 border border-transparent focus:bg-white focus:border-blue-100 rounded-lg py-1 pl-8 pr-4 text-[9px] font-black text-gray-900 outline-none transition-all placeholder:uppercase placeholder:tracking-widest"
              />
            </div>

            <div className="h-6 w-px bg-gray-100" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-900 leading-none uppercase">{user?.first_name || 'Instructor'}</p>
                  <p className="text-[7px] font-black text-blue-600 mt-1 uppercase tracking-widest">Expert-Operator</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-[9px] shadow-lg shadow-blue-100 italic">
                  {user?.first_name?.[0] || 'I'}
                </div>
              </div>
              <Link href="/instructor/settings" className="p-1.5 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors text-gray-400">
                <Settings size={14} />
              </Link>
              <button onClick={handleLogout} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-gray-400">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 pb-10">{children}</div>

      <Link href="/instructor/ai-generator" className="fixed bottom-6 right-6 z-[100] group">
        <div className="h-10 w-10 bg-gray-950 rounded-xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:-translate-y-1 border border-white/5">
          <Zap size={14} className="group-hover:text-blue-400 transition-colors" />
        </div>
      </Link>
    </div>
  );
}

function NavLink({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black text-gray-400 hover:text-blue-600 hover:bg-white transition-all uppercase tracking-widest">
      {icon} {label}
    </Link>
  );
}
