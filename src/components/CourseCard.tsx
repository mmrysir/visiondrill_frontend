'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Bookmark, Eye, Star } from 'lucide-react';

interface Author { picture: string; fullname: string; }
interface Course {
  id: number; slug: string; thumbnail: string; course_title: string; view: number;
  author: Author; userHasLiked: boolean; userHasDisliked: boolean; hasBookmarked: boolean;
  is_unlocked: boolean; is_private: boolean; isPaid: boolean; price?: number;
  formattedPrice: string; level?: string; progress_percentage?: number;
}
interface CourseCardProps { course: Course; }

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [userHasBookmarked, setUserHasBookmarked] = useState(course.hasBookmarked);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      if (userHasBookmarked) {
        await api.delete(`/course/${course.id}/delete-bookmark`);
        setUserHasBookmarked(false);
      } else {
        await api.post(`/course/${course.id}/create-bookmark`);
        setUserHasBookmarked(true);
      }
    } catch {}
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden">
      <div className="relative aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        <Link href={`/course/${course.slug}`}>
          <img
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            src={course.thumbnail}
            alt={course.course_title}
            loading="lazy"
          />
        </Link>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/90 backdrop-blur-md rounded text-[7px] font-black text-white uppercase tracking-widest">
          <Eye size={10} className="text-blue-400" /> {course.view}
        </div>
        <button 
          onClick={toggleBookmark}
          className={`absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${userHasBookmarked ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Bookmark size={12} fill={userHasBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col p-4">
        <Link href={`/course/${course.slug}`}>
          <h3 className="text-[10px] font-black text-gray-900 leading-[1.2] mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-wide">
            {course.course_title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{course.author.fullname}</span>
        </div>
        {course.progress_percentage !== undefined && (
          <div className="mb-4">
            <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${course.progress_percentage}%` }} />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Star size={10} fill="#fb8c00" className="text-[#fb8c00]" />
            <span className="text-[8px] font-black text-gray-900 uppercase">4.8</span>
          </div>
          <div className="text-[10px] font-black text-gray-900 tracking-tighter uppercase italic">
            {course.isPaid ? `$${course.formattedPrice || '49.99'}` : (
              <span className="text-blue-600">Free Access</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
