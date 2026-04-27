'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Activity, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  BarChart3, 
  PieChart, 
  Clock,
  Layout,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/student/analytics/progress');
        setData(res.data || []);
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 animate-pulse space-y-12">
        <div className="h-32 bg-gray-50 rounded-3xl w-1/3"></div>
        <div className="space-y-6">
           {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 pb-32">
      
      {/* Header section */}
      <div className="mb-12">
         <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                     Performance Engine
                  </div>
                  <span className="text-gray-400 font-bold text-xs">• Tracking {data.length} active curricula</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight mb-8">
                 Precise <br />
                 <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent italic">Analytics.</span>
               </h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                  <Activity size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Mastery</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">
                    {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.progress, 0) / data.length) : 0}%
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8">
         {data.map((course) => (
            <div key={course.course_id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all">
               {/* Course Summary Row */}
               <div 
                  className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group"
                  onClick={() => setExpandedCourse(expandedCourse === course.course_id ? null : course.course_id)}
               >
                  <div className="flex items-center gap-6 flex-1">
                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
                        <Layout size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors uppercase">{course.course_title}</h3>
                        <div className="flex items-center gap-4">
                           <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                           </div>
                           <span className="text-xs font-black text-blue-600">{course.progress}% Completed</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Modules</p>
                        <p className="text-xl font-black text-gray-900">{course.sections.length}</p>
                     </div>
                     <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {expandedCourse === course.course_id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                     </div>
                  </div>
               </div>

               {/* Expanded Details */}
               {expandedCourse === course.course_id && (
                  <div className="px-8 pb-10 pt-4 border-t border-gray-50 bg-gray-50/30">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {course.sections.map((section: any) => (
                           <div key={section.id} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate max-w-[200px]">{section.title}</h4>
                                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{section.lessons.length} Lessons</span>
                              </div>
                              <div className="space-y-2">
                                 {section.lessons.map((lesson: any) => (
                                    <div key={lesson.id} className="flex items-center justify-between g-2">
                                       <div className="flex items-center gap-2 min-w-0">
                                          {lesson.completed ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Circle size={14} className="text-gray-200 shrink-0" />}
                                          <span className={`text-[11px] font-medium truncate ${lesson.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                             {lesson.title}
                                          </span>
                                       </div>
                                       {lesson.completed_at && (
                                          <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                                             {new Date(lesson.completed_at).toLocaleDateString()}
                                          </span>
                                       )}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="mt-8 flex justify-end">
                        <Link href={`/student/courses/${course.course_title.toLowerCase().replace(/ /g, '-')}/continue`}>
                           <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200">
                              Resume Learning Context <PlayCircle size={16} />
                           </button>
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         ))}

         {data.length === 0 && (
            <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
               <BarChart3 size={64} className="mx-auto text-gray-100 mb-6" />
               <h3 className="text-2xl font-black text-gray-900 mb-2">No Performance Data</h3>
               <p className="text-gray-500 font-medium max-w-sm mx-auto">Start completing lessons in your enrolled courses to see real-time performance analytics here.</p>
            </div>
         )}
      </div>
    </div>
  );
}
