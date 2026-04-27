'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DollarSign, TrendingUp, Download, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Loader2, Calendar, CreditCard, Layout } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function InstructorRevenue() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, dashboardRes, revenueRes] = await Promise.all([
          api.get('/me'),
          api.get('/instructor/dashboard-stats'),
          api.get('/instructor/revenue')
        ]);
        setUser(userRes.data);
        // Combine stats for the UI
        setStats({
          ...dashboardRes.data,
          ...revenueRes.data
        });
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/instructor" className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-gray-400">
            <Layout size={20} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase leading-none">Financial Hub</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Instructor Revenue & Payouts</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
           <Link href="/courses" className="text-sm font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Browse Hub</Link>
           <Link href="/instructor" className="text-sm font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Dashboard</Link>
           <Link href="/instructor/settings" className="group">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                {user?.first_name?.[0] || 'I'}
              </div>
           </Link>
           <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors">
              Logout
           </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-2">Revenue Analytics</h1>
            <p className="text-gray-500 font-medium">Track your earnings, withdrawal history, and course performance.</p>
          </div>
          <Button className="flex items-center gap-2 px-6 py-4 bg-gray-900 hover:bg-black text-[11px] font-black tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-gray-200">
             <Download size={16} /> Export Financial Report
          </Button>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           <FinanceCard title="Total Earnings" value={`$${stats?.total_earnings?.toLocaleString() || '0.00'}`} trend="+12.5%" icon={<DollarSign size={20} />} color="text-blue-600" bg="bg-blue-50" />
           <FinanceCard title="Pending Payout" value={`$${stats?.pending_payout?.toLocaleString() || '0.00'}`} trend="-0.0%" icon={<TrendingUp size={20} />} color="text-purple-600" bg="bg-purple-50" />
           <FinanceCard title="Courses Sold" value={stats?.total_students?.toString() || "0"} trend="+5.0%" icon={<Layout size={20} />} color="text-orange-600" bg="bg-orange-50" />
           <FinanceCard title="Referral Earnings" value="$0.00" trend="+0.0%" icon={<ArrowUpRight size={20} />} color="text-green-600" bg="bg-green-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           {/* Chart Placeholder Area */}
           <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="text-blue-600" size={20} /> Monthly Revenue
                 </h3>
                 <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-400">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                 </select>
              </div>
              <div className="h-[300px] w-full bg-gray-50 rounded-3xl flex items-center justify-center flex-col gap-4 border-2 border-dashed border-gray-100 group-hover:border-blue-100 transition-colors">
                  <PieChart className="text-gray-200 group-hover:text-blue-100 transition-colors" size={64} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Analytics Loading...</p>
              </div>
           </div>

           {/* Recent Transactions */}
           <div className="lg:col-span-1 bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                 <CreditCard className="text-purple-600" size={20} /> Latest Sales
              </h3>
              <div className="space-y-4">
                 {stats?.recent_sales?.length > 0 ? (
                    stats.recent_sales.map((sale: any) => (
                      <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-100">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black text-xs">
                               #{sale.id}
                            </div>
                            <div className="min-w-0">
                               <p className="text-xs font-black text-gray-900 uppercase truncate max-w-[120px]">{sale.course_title}</p>
                               <p className="text-[10px] text-gray-400 font-bold">{sale.date}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-gray-900">+${sale.amount}</p>
                            <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 px-2 py-0.5 rounded">{sale.status}</span>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="py-12 text-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase">No recent sales</p>
                    </div>
                 )}
              </div>
              <button className="w-full mt-6 py-4 text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 tracking-widest border-t border-gray-50 transition-colors">
                 View All Transactions
              </button>
           </div>
        </div>

        {/* Withdrawal Area */}
        <div className="bg-blue-950 rounded-2xl p-10 text-white relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-24 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                 <h2 className="text-3xl font-black uppercase italic mb-4">Cashing out your profit?</h2>
                 <p className="text-gray-400 font-medium leading-relaxed mb-8">
                    We process all instructor payouts on a bi-weekly basis. Ensure your payout details (M-Pesa/Bank) are correctly verified in your school settings.
                 </p>
                 <div className="flex items-center gap-8">
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Available for Withdrawal</p>
                       <p className="text-4xl font-black text-blue-400">$8,450.00</p>
                    </div>
                    <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Last Payout</p>
                       <p className="text-xl font-black text-white">$4,000.00</p>
                    </div>
                 </div>
              </div>
              <button className="px-12 py-5 bg-blue-600 hover:bg-black text-white font-black rounded-xl transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
                 Request withdrawal
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}

function FinanceCard({ title, value, trend, icon, color, bg }: any) {
   const isUp = trend.startsWith('+');
   return (
      <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
             <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {icon}
             </div>
             <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black ${isUp ? 'text-blue-500' : 'text-red-500'}`}>
                   {trend}
                </span>
                <span className="text-[10px] font-bold text-gray-400 mt-1">Status</span>
             </div>
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{value}</div>
          <p className="text-[10px] font-black text-gray-400">{title}</p>
      </div>
   );
}
