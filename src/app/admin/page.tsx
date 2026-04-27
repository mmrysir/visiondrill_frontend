'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Shield, Users, Layout, Settings, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, pendingApprovals: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch admin stats (Endpoint would need to be created if not exists)
        // const response = await api.get('/admin/stats');
        // setStats(response.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <nav className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-900 text-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-500" size={24} />
          <span className="text-xl font-black tracking-tighter">VISIONDRILL <span className="text-gray-500 ml-1">ADMIN</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            AD
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight  mb-2">Platform Overview</h1>
          <p className="text-gray-500 font-medium">Global control center for VisionDrill users, courses, and system health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           <AdminStatCard icon={<Users className="text-blue-600" />} label="Total Users" value="2,450" change="+12%" />
           <AdminStatCard icon={<Layout className="text-purple-600" />} label="Global Courses" value="184" change="+5%" />
           <AdminStatCard icon={<CheckCircle2 className="text-green-600" />} label="Active Students" value="1,200" change="+18%" />
           <AdminStatCard icon={<AlertCircle className="text-orange-600" />} label="Pending Review" value="12" change="Action Req" warning />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-gray-900  mb-8 flex items-center">
                 <TrendingUp className="mr-3 text-blue-600" size={20} /> System Activity
              </h3>
              <div className="h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold">
                 Activity Chart Placeholder
              </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-gray-900  mb-8 flex items-center">
                 <Settings className="mr-3 text-blue-600" size={20} /> Quick Links
              </h3>
              <div className="space-y-3">
                 <AdminLink title="User Management" sub="Access & Roles" href="/admin/users" />
                 <AdminLink title="Course Moderation" sub="Review drafts" href="/admin/courses" />
                 <AdminLink title="System Logs" sub="Error monitoring" href="/admin/logs" />
                 <AdminLink title="Global Settings" sub="Platform config" href="/admin/settings" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function AdminStatCard({ icon, label, value, change, warning }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{icon}</div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${warning ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>{change}</span>
      </div>
      <div className="text-2xl font-black text-gray-900 tracking-tighter">{value}</div>
      <p className="text-gray-400 text-[10px] font-bold  tracking-widest">{label}</p>
    </div>
  );
}

function AdminLink({ title, sub, href }: any) {
  return (
    <Link href={href} className="block p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all group">
       <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h4>
       <p className="text-gray-400 text-[10px]  font-bold tracking-wider">{sub}</p>
    </Link>
  );
}
