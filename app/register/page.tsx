'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  Grid
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      setStatus({ type: 'error', text: 'Passwords do not match!' });
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
        }

        setStatus({ type: 'success', text: 'Account created! Redirecting...' });

        setTimeout(() => router.push('/login'), 2000);
      } else {
        const errorMessage =
          res.status === 409
            ? 'This email is already registered.'
            : data.message || 'Registration failed';

        setStatus({ type: 'error', text: errorMessage });
      }
    } catch {
      setStatus({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

   return (
    <>
     <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, minHeight: '100vh'}}>
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(226,232,240,0.7)' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Just to Manage Your Dashboard
              </Typography>
            </Box>
           <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                size="small"
                sx={{ mb: 3 }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              <Button
                type="submit"
                fullWidth
                variant="contained" 
                disabled={loading}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create Account'}
              </Button>

              <Button
                fullWidth
                onClick={() => router.push('/login')}
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  color: '#2563eb',
                  fontWeight: 600,
                }}
              >
                Already have an account? Login
              </Button>

            </form>

          </Card>
        </Grid>
      </Grid>
    </>
  );
}