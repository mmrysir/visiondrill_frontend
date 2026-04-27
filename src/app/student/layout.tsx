'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import BrandLogo from '@/components/BrandLogo';
import { api } from '@/lib/api';
import { 
  Layout, 
  Settings, 
  LogOut, 
  Heart,
  Users,
  Search
} from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-1 bg-white/90 backdrop-blur-2xl shadow-sm border-b border-blue-50' : 'py-2 bg-white/50'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <BrandLogo subtitle="Student console" />
            <div className="flex items-center gap-1 bg-gray-100/30 p-1 rounded-lg">
              <NavLink href="/student/courses" icon={<Layout size={10} />} label="Learning" />
              <NavLink href="/student/cohorts" icon={<Users size={10} />} label="Cohorts" />
              <NavLink href="/student/wishlist" icon={<Heart size={10} />} label="Wishlist" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center relative w-40">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={10} />
              </div>
              <input 
                type="text" 
                placeholder="Scan catalog..." 
                className="w-full bg-gray-100/30 border border-transparent focus:bg-white focus:border-blue-100 rounded-lg py-1 pl-8 pr-4 text-[9px] font-black text-gray-900 outline-none transition-all placeholder:uppercase placeholder:tracking-widest"
              />
            </div>

            <div className="h-6 w-px bg-gray-100" />

            <div className="flex items-center gap-4">
              <Link href="/student/settings" className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-900 leading-none uppercase">{user?.first_name || 'Learner'}</p>
                  <p className="text-[7px] font-black text-blue-600 mt-1 uppercase tracking-widest">Protocol-Active</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-[9px] shadow-lg shadow-blue-100">
                  {user?.first_name?.[0] || 'L'}
                </div>
              </Link>
              <button onClick={handleLogout} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-gray-400">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 pb-10">
        <Toaster />
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black text-gray-400 hover:text-blue-600 transition-all uppercase tracking-widest">
      {icon} {label}
    </Link>
  );
}
