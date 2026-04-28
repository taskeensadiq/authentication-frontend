
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = JSON.parse(localStorage.getItem('role') || '[]');

      if (!token) {
        router.push('/login');
        return;
      }

      if (
        allowedRoles &&
        !allowedRoles.some((r) => role.includes(r))
      ) {
        router.push('/products/crud');
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <h2>Verifying Session...</h2>
      </div>
    );
  }

  return <>{children}</>;
}