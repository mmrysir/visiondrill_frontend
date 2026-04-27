'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { 
  ChevronLeft, 
  CheckCircle2, 
  PlayCircle, 
  Lock,
  Search,
  Menu,
  X
} from 'lucide-react';

export default function StudentLearnLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const pathname = usePathname();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    api.get(`/courses/${slug}`).then(res => {
      setCourse(res.data);
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) return <div className="h-screen bg-white flex items-center justify-center font-bold text-gray-400">Loading curriculum...</div>;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Curriculum Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        transition-all duration-300 border-r border-gray-100 flex flex-col bg-gray-50/50
      `}>
        <div className="p-6 border-b border-gray-100 bg-white">
           <Link href="/student/courses" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors  tracking-widest mb-4">
              <ChevronLeft size={16} /> Back to hub
           </Link>
           <h2 className="text-xl font-black text-gray-900 tracking-tight line-clamp-2">{course?.course_title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {course?.sections?.map((section: any, idx: number) => (
            <div key={section.id} className="mb-2">
              <div className="px-6 py-3 text-[10px] font-bold text-gray-400  tracking-[0.2em]">{section.title}</div>
              <div className="space-y-1 px-3">
                {section.lessons?.map((lesson: any) => {
                  const isActive = pathname.includes(lesson.id);
                  return (
                    <Link key={lesson.id} href={`/student/learn/${slug}/lesson/${lesson.id}`}>
                      <div className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                        ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-white text-gray-600'}
                      `}>
                        {lesson.completed ? (
                          <CheckCircle2 size={16} className={isActive ? 'text-white' : 'text-emerald-500'} />
                        ) : (
                          <PlayCircle size={16} className={isActive ? 'text-white' : 'text-gray-300'} />
                        )}
                        <span className="text-xs font-bold truncate leading-none">{lesson.lesson_title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Player Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-50 shrink-0">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"
           >
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                 <span className="text-xs font-bold text-gray-400">Total progress</span>
                 <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '12%' }} />
                 </div>
                 <span className="text-xs font-sans font-bold text-blue-600">12%</span>
              </div>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
