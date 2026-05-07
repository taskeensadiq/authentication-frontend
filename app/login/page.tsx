'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
// import { useRoles } from '@/context/RoleContext';
import { UserRole } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { json } from 'stream/consumers';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, fetchWhoAmI } = useAuth();
  // const { setRole } = useRoles();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const res = await fetch('http://localhost:4000/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   const data = await res.json();

  //   if (!res.ok) {
  //     alert(data.message || 'Login failed');
  //     return;
  //   }

  //   const token = data.access_token;
  //   login(token);
  //   await fetchWhoAmI(token);
  //   const user = data.user;

  //   if (!token || !user) {
  //     alert('Invalid backend response');
  //     return;
  //   }


  //   localStorage.setItem('token', token);
  //   // localStorage.setItem('user', JSON.stringify(user));
  //   router.push('/products/crud');
  // };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || 'Login failed');
    return;
  }

  const token = data.access_token;

  if (!token) {
    alert('Invalid backend response');
    return;
  }

  // 1. store token
  login(token);

  // 2. load real user from backend
  // await fetchWhoAmI(token);

  // 3. navigate AFTER user is loaded
  router.push('/products/crud');
};


  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);


  return (
    <>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, minHeight: '100vh' }}>
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(226,232,240,0.7)' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Login
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Welcome back! Please sign in.
              </Typography>
            </Box>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextField
                label="Email"
                type="email"

                fullWidth
                required
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                Sign In
              </Button>
              <Button

                type="button"
                onClick={() => router.push('/register')}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#2563eb',
                }}
              >
                Don't have an account? Register
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}