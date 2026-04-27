'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  ChevronRight, 
  Copy, 
  CheckCircle2,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliatePage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/student/affiliate-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const copyRefLink = () => {
    const link = `${window.location.origin}/register?ref=${stats?.affiliate_tag}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="text-blue-600 animate-spin" size={32} />
      <p className="text-sm font-bold text-gray-400">Loading affiliate ledger...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Affiliate program</h1>
        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl">
          Promote excellence and earn rewards. Get a {stats?.commission_percentage || 10}% commission for every student you refer to VisionDrill.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FinanceCard 
           label="Unpaid balance" 
           value={`KES ${stats?.balance || '0.00'}`} 
           icon={Wallet} 
           color="text-blue-600" 
           bg="bg-blue-50"
           action="Request payout"
        />
        <FinanceCard 
           label="Total earnings" 
           value={`KES ${stats?.total_earned || '0.00'}`} 
           icon={TrendingUp} 
           color="text-emerald-600" 
           bg="bg-emerald-50"
        />
        <FinanceCard 
           label="Referred students" 
           value={stats?.referrals_count?.toString() || '00'} 
           icon={Users} 
           color="text-purple-600" 
           bg="bg-purple-50"
        />
      </div>

      {/* Referral Link & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Link Generator */}
        <div className="lg:col-span-5">
           <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6">Your referral link</h3>
              <div className="space-y-4">
                 <div className="relative">
                    <input 
                      readOnly 
                      value={`${window.location.origin}/register?ref=${stats?.affiliate_tag || ''}`}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-4 pr-12 py-4 text-sm font-sans text-gray-600"
                    />
                    <button 
                      onClick={copyRefLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                    >
                       {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-50 rounded-2xl">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                       <DollarSign size={16} />
                    </div>
                    <p className="text-xs font-bold text-blue-700 leading-tight">
                       Share this link with your network to earn KES on every enrollment.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Referral List */}
        <div className="lg:col-span-7">
           <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-900">Referral history</h3>
                 <span className="text-xs font-bold text-gray-400  tracking-widest">{stats?.referred_users?.length || 0} Records</span>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                       <tr>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400  tracking-widest">Student</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400  tracking-widest text-center">Status</th>
                          <th className="px-8 py-4 text-xs font-bold text-gray-400  tracking-widest text-right">Joined</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {stats?.referred_users?.map((ref: any) => (
                         <tr key={ref.id}>
                            <td className="px-8 py-5">
                               <p className="font-bold text-gray-900">{ref.first_name} {ref.last_name}</p>
                            </td>
                            <td className="px-8 py-5 text-center">
                               <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black  tracking-widest border border-emerald-100">Verified</span>
                            </td>
                            <td className="px-8 py-5 text-right font-sans text-xs text-gray-400">
                               {new Date(ref.created_at).toLocaleDateString('en-GB')}
                            </td>
                         </tr>
                       ))}
                       {(!stats?.referred_users || stats?.referred_users.length === 0) && (
                         <tr>
                            <td colSpan={3} className="px-8 py-12 text-center text-gray-400 font-medium italic">
                               No referrals recorded yet. Start sharing to see them here.
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ label, value, icon: Icon, color, bg, action }: any) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all group relative overflow-hidden">
       {action && (
         <button className="absolute top-8 right-8 text-[10px] font-black text-blue-600  tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
            {action}
         </button>
       )}
       <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
       </div>
       <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1 font-sans">{value}</div>
       <p className="text-xs font-bold text-gray-400  tracking-widest">{label}</p>
    </div>
  );
}
