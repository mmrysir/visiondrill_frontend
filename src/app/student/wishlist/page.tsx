'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Bookmark, 
  Search, 
  ArrowRight, 
  Star, 
  Clock, 
  Trash2,
  Loader2,
  BookMarked
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/student/wishlist')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="text-blue-600 animate-spin" size={32} />
      <p className="text-sm font-bold text-gray-400">Loading saved assets...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Bookmark size={20} />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Wishlist</h1>
           </div>
           <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xl">
             Your curated collection of curriculum nodes. Ready for enrollment when you are.
           </p>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-right">
             <p className="text-xl font-bold text-gray-900 leading-none">{courses.length}</p>
             <p className="text-[10px] font-bold text-gray-400  tracking-widest mt-1">Saved courses</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all group flex flex-col h-full">
             <div className="aspect-video bg-gray-100 relative overflow-hidden shrink-0">
                <Image 
                  src={course.image || '/course-placeholder.jpg'} 
                  alt={course.course_title}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 z-10">
                   <button className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-black/5">
                      <Trash2 size={16} />
                   </button>
                </div>
             </div>

             <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-amber-400">
                         <Star size={12} fill="currentColor" />
                         <Star size={12} fill="currentColor" />
                         <Star size={12} fill="currentColor" />
                         <Star size={12} fill="currentColor" />
                         <Star size={12} fill="currentColor" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400  tracking-widest">4.9 Mastery</span>
                   </div>
                   <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                      {course.course_title}
                   </h3>
                   <p className="text-xs font-bold text-gray-400  tracking-widest flex items-center gap-1">
                      By <span className="text-gray-900">{course.author?.first_name || 'Expert'}</span>
                   </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400  tracking-widest">Pricing</span>
                      <span className="text-lg font-black text-gray-900 font-sans">KES {course.price || '0'}</span>
                   </div>
                   <Link href={`/courses/${course.slug}`}>
                      <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                         Enroll <ArrowRight size={14} />
                      </button>
                   </Link>
                </div>
             </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-24 text-center bg-transparent border-2 border-dashed border-gray-100 rounded-[3rem]">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
              <BookMarked size={32} />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">Wishlist empty</h4>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">You haven't bookmarked any courses yet. Browse the catalog to save interesting curricula.</p>
            <Link href="/courses">
              <button className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:scale-105 transition-all">Explore catalog</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
