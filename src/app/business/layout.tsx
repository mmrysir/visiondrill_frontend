'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import BrandLogo from '@/components/BrandLogo';
import { 
  Users, 
  Layout, 
  Settings, 
  Briefcase, 
  LogOut, 
  TrendingUp, 
  Zap,
  Building2
} from 'lucide-react';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    api.get('/me').then(res => setUser(res.data)).catch(() => {});
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      {/* Modern Enterprise Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? 'py-3 bg-white/80 backdrop-blur-2xl shadow-sm border-b border-purple-100' : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <BrandLogo subtitle="Enterprise Console" />

            <div className="hidden lg:flex items-center gap-6 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
               <NavLink href="/business" icon={<Layout size={16} />} label="Overview" />
               <NavLink href="/business/employees" icon={<Users size={16} />} label="Workforce" />
               <NavLink href="/business/programs" icon={<Briefcase size={16} />} label="Training" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-gray-400  tracking-widest">
               <Building2 size={14} className="text-purple-600" /> B2B Portal
            </div>
            
            <div className="h-8 w-px bg-gray-100"></div>

            <div className="flex items-center gap-4 group">
               <Link href="/business/settings" className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black text-gray-900 leading-none">{user?.first_name || 'Admin'}</p>
                     <p className="text-[10px] font-bold text-gray-400 mt-1 ">Manager</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-purple-100 group-hover:scale-110 transition-all">
                     {user?.first_name?.[0] || 'M'}
                  </div>
               </Link>
               <button onClick={handleLogout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-gray-400">
                  <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black  tracking-widest text-gray-500 hover:text-purple-600 hover:bg-white hover:shadow-sm transition-all">
       {icon} {label}
    </Link>
  );
}
