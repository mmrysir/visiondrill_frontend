'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  BookOpen,
  Globe,
  Brain,
  Cpu,
  Activity,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Award,
  ChevronRight,
  Play,
  Star
} from 'lucide-react';

import CourseCard from '@/components/CourseCard';
import BrandLogo from '@/components/BrandLogo';

const mockCourses = [
  {
    id: 1, slug: 'digital-marketing-mastery',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    course_title: 'Digital Marketing Mastery 2024: From Zero to Hero',
    view: 1240,
    author: { fullname: 'Sarah Johnson', picture: 'https://i.pravatar.cc/150?u=sarah' },
    userHasLiked: false, userHasDisliked: false, hasBookmarked: false,
    is_unlocked: true, is_private: false, isPaid: true, formattedPrice: '49.99', level: 'Expert'
  },
  {
    id: 2, slug: 'creative-graphic-design',
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde3?q=80&w=800&auto=format&fit=crop',
    course_title: 'UI/UX Design Fundamentals: Building Modern Apps',
    view: 850,
    author: { fullname: 'Michael Chen', picture: 'https://i.pravatar.cc/150?u=michael' },
    userHasLiked: true, userHasDisliked: false, hasBookmarked: true,
    is_unlocked: true, is_private: false, isPaid: false, formattedPrice: '0.00', level: 'Beginner'
  },
  {
    id: 3, slug: 'advanced-web-development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    course_title: 'Advanced Full-Stack Web Development: The Complete Guide',
    view: 2100,
    author: { fullname: 'Alex Rivera', picture: 'https://i.pravatar.cc/150?u=alex' },
    userHasLiked: false, userHasDisliked: false, hasBookmarked: false,
    is_unlocked: true, is_private: false, isPaid: true, formattedPrice: '99.00', level: 'Intermediate'
  }
];

const partners = [
  { src: '/images/partners/fresh-m-radio-logo.svg', alt: 'Fresh M Radio' },
  { src: '/images/partners/ajira.png', alt: 'Ajira' },
  { src: '/images/partners/iyef.png', alt: 'IYEF' },
  { src: '/images/partners/kepsa.png', alt: 'KEPSA' },
  { src: '/images/partners/mastercard-foundations.png', alt: 'Mastercard Foundation' },
];

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const fetchData = async () => {
      try {
        const [courseRes, userRes] = await Promise.allSettled([
          api.get('/courses/popular'),
          api.get('/me')
        ]);
        if (courseRes.status === 'fulfilled' && courseRes.value.data?.length > 0) setCourses(courseRes.value.data);
        if (userRes.status === 'fulfilled') setUser(userRes.value.data);
      } catch {}
    };
    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur-xl border-b border-white/5 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-8xl mx-auto px-8 flex items-center justify-between gap-8">
          <div className="flex items-center gap-10 flex-shrink-0">
            <BrandLogo variant="light" />
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/courses" className="text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Marketplace</Link>
              <Link href="/courses" className="text-[9px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">Subtitles</Link>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            {!user ? (
              <>
                <Link href="/login" className="text-[9px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors hidden sm:block">Login</Link>
                <Link href="/register">
                  <button className="h-8 px-5 bg-blue-600 text-white rounded font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 transition-all">Join Now</button>
                </Link>
              </>
            ) : (
              <Link href={user.roles?.some((r: any) => r.name === 'author') ? '/instructor' : '/student'}>
                <button className="h-8 px-5 bg-blue-600 text-white rounded font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 transition-all">Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-8 pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />
        
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-8xl mx-auto w-full">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase tracking-widest">
                <Activity size={10} /> <span>15,000+ Active Learners</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Global Platform</span>
            </div>

            <h1 className="text-6xl xl:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase">
              LEARN FROM EXPERTS<br />
              <span className="text-blue-500">THROUGH TAILORED</span><br />
              PATHWAYS.
            </h1>

            <p className="text-white/40 font-black text-[11px] uppercase tracking-widest leading-loose mb-12 max-w-xl">
              Trusted by 15,000 learners worldwide. Visiondrill provides marketable, industry-applicable online courses for all levels.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register">
                <button className="h-12 px-8 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest rounded hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20">
                  <Play size={12} /> Start Learning
                </button>
              </Link>
              <Link href="/courses">
                <button className="h-12 px-8 bg-white/5 border border-white/10 text-white/60 font-black text-[9px] uppercase tracking-widest rounded hover:bg-white/10 hover:text-white transition-all flex items-center gap-3">
                  Browse Courses <ChevronRight size={12} />
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 mt-12 pt-12 border-t border-white/5">
              {[
                { icon: <Shield size={14} />, label: 'Verified Certificates' },
                { icon: <Globe size={14} />, label: 'Global Access' },
                { icon: <Brain size={14} />, label: 'AI-Powered Learning' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/30">
                  {item.icon}
                  <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-8xl mx-auto px-8">
          <p className="text-center text-[8px] font-black text-white/20 uppercase tracking-widest mb-8">Our Partners &amp; Sponsors</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {partners.map((p, i) => (
              <img key={i} src={p.src} alt={p.alt} className="h-8 object-contain opacity-30 hover:opacity-70 transition-opacity grayscale" />
            ))}
          </div>
        </div>
      </section>

      {/* Launchpad / Features — Horizontally Scrollable */}
      <section id="features" className="py-24">
        <div className="max-w-8xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap size={14} className="text-blue-500" />
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Platform Launchpad</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Everything you need<br /><span className="text-white/30">to learn &amp; grow.</span></h2>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-white/20 text-[8px] font-black uppercase tracking-widest">
              <ChevronRight size={12} /> scroll
            </div>
          </div>
        </div>

        {/* Scrollable strip — no left padding so cards bleed to edge, right padding for fade effect */}
        <div className="relative">
          {/* Fade right edge */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-px overflow-x-auto pb-4 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { icon: <BookOpen size={20} />, title: 'Expert Courses', desc: 'Curated curriculum from vetted industry professionals.' },
              { icon: <Brain size={20} />, title: 'AI Assistance', desc: 'AI-powered summaries, transcripts, and adaptive paths.' },
              { icon: <Users size={20} />, title: 'Cohort Groups', desc: 'Learn collaboratively with peers in structured cohorts.' },
              { icon: <Award size={20} />, title: 'Certifications', desc: 'Industry-recognized certificates on completion.' },
              { icon: <Activity size={20} />, title: 'Live Analytics', desc: 'Real-time tracking of progress and milestones.' },
              { icon: <Globe size={20} />, title: 'Global Access', desc: 'Access courses in multiple languages from anywhere.' },
              { icon: <Cpu size={20} />, title: 'Video Conferencing', desc: 'Built-in live class sessions with your instructors.' },
              { icon: <TrendingUp size={20} />, title: 'Monetization', desc: 'Instructors can publish and earn from their expertise.' },
            ].map((feat, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 p-8 bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-blue-500/20 transition-all group cursor-default rounded-xl"
                style={{ minWidth: '240px' }}
              >
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-600/20 group-hover:scale-110 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">{feat.title}</h3>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-24 px-8 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Star size={12} className="text-blue-500" />
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Popular Courses</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Trending curriculum.</h2>
            </div>
            <Link href="/courses" className="text-[8px] font-black text-white/30 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
              All Courses <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses.length > 0 ? courses : mockCourses).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <BrandLogo variant="light" className="mb-6" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-relaxed mb-8 max-w-xs">
                Engineering the next generation of professional excellence through tailored expert pathways.
              </p>
              <div className="flex gap-3">
                {[Globe, Activity, Brain].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/20 transition-all cursor-pointer">
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: 'Company', links: [{ name: 'About', path: '/about' }, { name: 'Careers', path: '/careers' }, { name: 'Contact', path: '/contact' }] },
              { title: 'Explore', links: [{ name: 'All Courses', path: '/courses' }, { name: 'Certifications', path: '#' }, { name: 'Instructors', path: '#' }] },
              { title: 'Legal', links: [{ name: 'Privacy', path: '/privacy' }, { name: 'Terms', path: '/terms' }, { name: 'Security', path: '/security' }] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="font-black text-[8px] uppercase tracking-widest text-white/20 mb-6">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((item, j) => (
                    <li key={j}>
                      <Link href={item.path} className="text-white/40 hover:text-white transition-colors font-black text-[9px] uppercase tracking-widest">{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">© 2026 Visiondrill. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" /> System Online
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
