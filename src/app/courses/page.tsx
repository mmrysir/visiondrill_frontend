'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import BrandLogo from '@/components/BrandLogo';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function CourseExplorer() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        // Handle Laravel pagination if it's paginated
        const data = response.data.data || response.data;
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-50">
         <BrandLogo subtitle="Course Catalog" />
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
           <div className="max-w-xl">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight capitalize mb-4">Explore Our Courses</h1>
              <p className="text-lg text-gray-500 font-medium">Marketable skills taught by leading industry professionals.</p>
           </div>
           
           <div className="w-full max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="What do you want to learn?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none font-medium transition-all shadow-sm"
              />
           </div>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
              ))}
           </div>
        ) : filteredCourses.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCourses.map(course => (
                 <CourseCard key={course.id} course={course} />
              ))}
           </div>
        ) : (
           <div className="py-32 text-center">
              <BookOpen size={64} className="mx-auto mb-6 text-gray-200" />
              <h3 className="text-2xl font-black text-gray-900 capitalize mb-2">No courses found</h3>
              <p className="text-gray-500 font-medium">Try searching for something else or browse our categories.</p>
           </div>
        )}
      </main>
    </div>
  );
}
