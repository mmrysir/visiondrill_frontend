'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Heart, Search, ArrowRight, BookOpen, Clock, Star } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

export default function WishlistPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/student/wishlist');
        setCourses(res.data || []);
      } catch (err) {
        console.error('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.course_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-8 pb-20">
      
      {/* Header section */}
      <div className="mb-12">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-pink-600/10 border border-pink-500/20 text-pink-600 text-[10px] font-black uppercase tracking-widest">
                     Saved for Later
                  </div>
                  <span className="text-gray-400 font-bold text-xs">• {courses.length} courses in wishlist</span>
               </div>
               <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
                 Course <br />
                 <span className="bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent italic text-4xl lg:text-5xl">Wishlist & Ideas.</span>
               </h1>
            </div>
            
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
               <input 
                  type="text" 
                  placeholder="Filter your wishlist..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-xl focus:border-pink-200 outline-none font-bold text-sm text-gray-900 transition-all shadow-sm"
               />
            </div>
         </div>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"></div>)}
         </div>
      ) : filteredCourses.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map(course => (
               <CourseCard key={course.id} course={course} />
            ))}
         </div>
      ) : (
         <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm space-y-8 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner group">
               <Heart size={48} className="group-hover:scale-110 transition-transform fill-pink-500" />
            </div>
            <div className="space-y-4">
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Your wishlist is empty</h2>
               <p className="text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
                  Find courses that spark your interest and save them here to plan your career growth.
               </p>
            </div>
            <div className="pt-4">
               <Link href="/courses">
                  <button className="px-12 py-5 bg-gray-900 text-white font-black rounded-xl tracking-widest uppercase shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-95 flex items-center gap-3 mx-auto">
                     Explore Curriculum <ArrowRight size={18} />
                  </button>
               </Link>
            </div>
         </div>
      )}
    </div>
  );
}
