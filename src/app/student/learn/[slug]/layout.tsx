'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, PlayCircle, CheckCircle, Lock, Layout } from 'lucide-react';

export default function LearnLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Extract lessonId from pathname for highlighting active state
  // Expected path: /student/learn/[slug]/lesson/[lessonId]
  const currentLessonId = pathname.split('/lesson/')[1];

  useEffect(() => {
    // We fetch the public course syllabus. The backend RBAC will verify ownership.
    api.get(`/courses/${params.slug}`)
      .then(res => {
         setCourse(res.data);
         
         // If no child route is active (just /student/learn/[slug]),
         // auto-redirect to the first lesson, or the backend's provided continue point.
         if (pathname.endsWith(params.slug)) {
            // Very naive redirection for now, will get first lesson:
            const firstLesson = res.data.sections?.[0]?.lessons?.[0]?.id;
            if (firstLesson) {
               router.replace(`/student/learn/${params.slug}/lesson/${firstLesson}`);
            }
         }
      })
      .catch(err => {
         console.error('Failed to load course lessons', err);
         router.push('/student/courses');
      })
      .finally(() => setIsLoading(false));
  }, [params.slug, pathname]);

  if (isLoading) {
     return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden font-sans">
      
      {/* Sidebar Curriculum (The Persistent State) */}
      <aside className="w-80 flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-10 transition-all duration-300">
         {/* Sidebar Header */}
         <div className="p-6 border-b border-white/5 bg-slate-900/80">
            <Link href="/student/courses" className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white capitalize tracking-widest mb-6 transition-colors w-fit">
               <ChevronLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-lg font-black text-white leading-tight capitalize pb-2">{course?.course_title}</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[10px] font-black capitalize tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">12% Complete</span>
            </div>
         </div>

         {/* Sections Map */}
         <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
            {course?.sections?.map((section: any, idx: number) => (
               <div key={section.id} className="mb-8">
                  <h3 className="text-[10px] font-black capitalize tracking-widest text-slate-500 mb-3 px-2">Section {idx + 1}: {section.title}</h3>
                  <div className="flex flex-col gap-1">
                     {section.lessons?.map((lesson: any) => {
                        const isActive = currentLessonId === String(lesson.id);
                        // Mock completed state for now until backend hook is wired
                        const isCompleted = false; 

                        return (
                           <Link key={lesson.id} href={`/student/learn/${params.slug}/lesson/${lesson.id}`}>
                              <div className={`p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                                 isActive ? 'bg-blue-600/10 border border-blue-500/20' : 'hover:bg-white/5 border border-transparent'
                              }`}>
                                 <div className="mt-0.5 shadow-sm">
                                    {isCompleted ? (
                                       <CheckCircle size={16} className="text-emerald-500" />
                                    ) : isActive ? (
                                       <PlayCircle size={16} className="text-blue-500" />
                                    ) : (
                                       <PlayCircle size={16} className="text-slate-600 group-hover:text-slate-400" />
                                    )}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className={`text-sm font-bold leading-snug transition-colors ${
                                       isActive ? 'text-blue-50' : 'text-slate-400 hover:text-slate-200'
                                    }`}>{lesson.title}</h4>
                                    <div className="text-[9px] font-bold text-slate-600 capitalize tracking-widest mt-2 flex items-center gap-2">
                                       <span>{lesson.duration || '10:00'} min</span>
                                       {lesson.video_url && <span>• Video</span>}
                                    </div>
                                 </div>
                              </div>
                           </Link>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </aside>

      {/* Main Video & Content Stage */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
         {/* The children prop is where the lesson page (video player) will be injected */}
         {children}
      </main>
    </div>
  );
}
