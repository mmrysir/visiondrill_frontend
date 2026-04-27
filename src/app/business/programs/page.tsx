'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Users, Globe, ExternalLink, Plus, Loader2, Target, Award } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

interface Program {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  enrolled_count: number;
}

export default function TrainingPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/business/training-programs');
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to load training programs', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900  tracking-tight mb-2">Training Programs</h1>
          <p className="text-gray-500 font-medium">Internal course catalog and development pathways for your workforce.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/instructor">
              <Button variant="outline" className="px-6 border-gray-200 text-gray-600 hover:bg-gray-50  tracking-widest text-[10px] font-black h-14 rounded-2xl">
                 Switch to Creator View
              </Button>
           </Link>
           <Link href="/instructor/create-course">
              <Button className="px-8 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl  tracking-widest text-[11px] h-14 shadow-xl shadow-purple-100 flex items-center gap-2">
                 <Plus size={18} /> New Internal Program
              </Button>
           </Link>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
           <BookOpen className="mx-auto mb-6 text-gray-100" size={80} />
           <h3 className="text-2xl font-black text-gray-800  mb-2">No programs yet</h3>
           <p className="text-gray-400 font-medium max-w-md mx-auto mb-8">You haven't created any internal training programs yet. Start by creating a course to train your employees.</p>
           <Button className="px-10 h-14">Launch Course Creator</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {programs.map(program => (
              <div key={program.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-purple-50 transition-all group">
                 <div className="h-52 bg-gray-100 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    {program.thumbnail ? (
                       <img src={program.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                          <Globe size={48} className="text-gray-300" />
                       </div>
                    )}
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black  tracking-widest text-purple-600 shadow-sm border border-purple-100">
                          Internal Only
                       </span>
                    </div>
                 </div>

                 <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors  tracking-tight mb-4 flex-grow">
                       {program.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-gray-50 p-4 rounded-3xl">
                          <div className="flex items-center gap-2 text-purple-600 mb-1">
                             <Users size={14} />
                             <span className="text-xl font-black">{program.enrolled_count}</span>
                          </div>
                          <p className="text-[10px] font-black text-gray-400  tracking-widest">Enrolled</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-3xl">
                          <div className="flex items-center gap-2 text-green-600 mb-1">
                             <Award size={14} />
                             <span className="text-xl font-black">78%</span>
                          </div>
                          <p className="text-[10px] font-black text-gray-400  tracking-widest">Comp. Rate</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <Link href={`/courses/${program.slug}`} target="_blank" className="flex-grow">
                          <Button variant="outline" className="w-full py-4 border-gray-100 text-gray-500 hover:bg-gray-50 text-[10px] font-black flex items-center justify-center gap-2 rounded-2xl transition-all">
                             <ExternalLink size={14} /> Preview
                          </Button>
                       </Link>
                       <Link href={`/business/staff?program=${program.id}`} className="flex-grow">
                          <Button className="w-full py-4 bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white text-[10px] font-black flex items-center justify-center gap-2 rounded-2xl transition-all shadow-none">
                             <Target size={14} /> Bulk Assign
                          </Button>
                       </Link>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
