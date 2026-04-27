'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await api.post('/logout');
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        // Clear local storage or session cookies if any are set manually
        localStorage.removeItem('token'); 
        // Redirect to login
        router.push('/login');
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400  tracking-widest">Terminating session...</p>
    </div>
  );
}
