import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  }
});

// Response interceptor for auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 (truly unauthenticated).
    // 403 means the user IS authenticated but lacks a role — do NOT log them out.
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const protectedRoutes = ['/student', '/instructor', '/business', '/admin'];
        const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
        
        if (isProtectedRoute && !path.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper for CSRF cookie (must hit the root, not the /api prefix)
export const getCsrfCookie = async () => {
  const rootUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0];
  await axios.get(`${rootUrl}/sanctum/csrf-cookie`, { withCredentials: true });
};
