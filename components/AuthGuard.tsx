
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role'); 

    //   if (!token) {
    //     router.push('/login');
    //   } else {
    //     setIsAuthorized(true);
    //   }
    // };

    if (!token) {
        router.push('/login');
        return;
      }

      // Role Check Logic
      if (allowedRoles && !allowedRoles.includes(role || '')) {
        setError(true);
        // Optional: auto-redirect after 3 seconds
        setTimeout(() => router.push('/dashboard'), 3000);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    // return () => window.removeEventListener('storage', checkAuth);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <h2 className="text-slate-600 font-medium">Verifying Session...</h2>
        <p className="text-slate-400 text-sm">Please wait while we check your credentials.</p>
      </div>
    );
  }

  return <>{children}</>;
}