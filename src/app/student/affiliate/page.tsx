'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  DollarSign, 
  Users, 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliatePage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/student/affiliate-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load affiliate stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${stats?.affiliate_tag}` 
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 animate-pulse space-y-12">
        <div className="h-40 bg-gray-50 rounded-3xl w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pb-32">
      
      {/* Header section */}
      <div className="mb-12">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest uppercase">
                     Affiliate Portal
                  </div>
                  <span className="text-gray-400 font-bold text-xs">• Earn {stats?.commission_percentage}% on every referral</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight mb-8">
                 Mastery <br />
                 <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent italic">Together.</span>
               </h1>
               <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
                  Share the VisionDrill curriculum with your network and earn commissions on every successful enrollment.
               </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-8 items-center w-full lg:w-fit">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                     <Wallet size={32} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
                     <p className="text-4xl font-black text-gray-900 tracking-tighter">${stats?.balance?.toFixed(2)}</p>
                  </div>
               </div>
               <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
               <button className="w-full md:w-fit px-8 py-4 bg-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                  Withdraw Funds
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
         {/* Referral Link Box */}
         <div className="lg:col-span-2 bg-blue-950 rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-600/20 transition-all duration-700"></div>
            <div className="relative z-10 space-y-8">
               <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Your Referral Link</h3>
                  <p className="text-gray-400 text-sm font-medium">Instantly earn when someone registers using this link.</p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 font-bold font-sans text-sm text-blue-400 truncate">
                     {referralLink}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-blue-400 transition-all"
                  >
                     {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                     {copied ? 'Copied' : 'Copy Link'}
                  </button>
               </div>
            </div>
         </div>

         {/* Mini Stats Grid */}
         <div className="grid grid-cols-1 gap-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center gap-6 group hover:shadow-xl transition-all">
               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Referrals</p>
                  <p className="text-3xl font-black text-gray-900">{stats?.referrals_count || 0}</p>
               </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center gap-6 group hover:shadow-xl transition-all">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Lifetime Earning</p>
                  <p className="text-3xl font-black text-gray-900">${stats?.total_earned?.toFixed(2)}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Referral Table */}
      <section>
         <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Referral Registry</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Active Trackers
            </div>
         </div>
         
         <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-50">
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined On</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {stats?.referred_users?.map((user: any) => (
                     <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-600">
                                 {user.first_name[0]}{user.last_name[0]}
                              </div>
                              <span className="font-bold text-sm text-gray-900">{user.first_name} {user.last_name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                              <Calendar size={14} className="text-gray-300" />
                              {new Date(user.created_at).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest">View Activity</button>
                        </td>
                     </tr>
                  ))}
                  {(!stats?.referred_users || stats.referred_users.length === 0) && (
                     <tr>
                        <td colSpan={3} className="px-8 py-20 text-center">
                           <div className="max-w-xs mx-auto space-y-4">
                              <DollarSign size={48} className="mx-auto text-gray-100" />
                              <p className="text-gray-400 font-medium text-sm">No referrals found yet. Share your link to start earning!</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>

    </div>
  );
}
