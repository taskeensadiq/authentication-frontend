'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show/Hide States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: "Passwords do not match!" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      const userRole = data.user?.role;

      if (res.ok) {
        if (userRole) {
          localStorage.setItem('role', userRole);
          console.log('Registered user role:', userRole);
        }

        setStatus({ type: 'success', text: 'Account created! Redirecting to login...' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        // Specifically check for conflict or existing user message
        const errorMessage = res.status === 409
          ? "This email is already registered."
          : (data.message || 'Registration failed');

        setStatus({ type: 'error', text: errorMessage });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold mb-2 text-center text-slate-800">Create Account</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">Join us to manage your dashboard</p>

        {status && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 uppercase">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-semibold text-slate-600 uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-semibold text-slate-600 uppercase">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

            <div className="flex flex-col gap-1 relative">
              <label className="text-xs font-semibold text-slate-600 uppercase">Enter Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="user">user</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
            </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </main>
  );
}