'use client';

import { Product } from '@/app/types/product';
import { TextField, Button, Paper, Typography, Card, Box } from '@mui/material';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
  onSubmit: (data: any) => void;
  editingProduct?: Product | null;
  onCancel: () => void;
}

export default function ProductForm({ onSubmit, editingProduct, onCancel }: Props) {
  const [form, setForm] = useState({ name: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    if (!editingProduct) return;

    setForm({
      name: editingProduct.name || '',
      description: editingProduct.description || '',
    });
  }, [editingProduct?.id]);

  return (
    <>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#0f172a',
              textAlign: 'center',
              mt: 4,
            }}
          >
            System Inventory
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              mt: 1,
              textAlign: 'center',
            }}
          >
            Manage your products, view analytics, and track inventory
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8} md={5} lg={4} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(226,232,240,0.7)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                letterSpacing: '1px',
                color: editingProduct ? '#d97706' : '#2563eb',
                textAlign: 'center',
              }}
            >
              {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
            </Typography>
            <TextField
              label="Product Name"
              required
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              size="small"
              fullWidth
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onSubmit(form);
                setForm({ name: '', description: '' });
              }}
              sx={{
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                color: '#ffffff !important',
                background: editingProduct
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              {editingProduct ? 'Update Product' : 'Save Product'}
            </Button>
            {editingProduct && (
              <Button
                onClick={onCancel}
                fullWidth
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  color: '#2563eb !important',
                  border: '1px solid #2563eb',
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => router.push('/products/crud')}
              fullWidth
              sx={{
                mt: 2,
                textTransform: 'none',
                color: '#2563eb !important',
                border: '1px solid #2563eb',
              }}
            >
              Go to Product List
            </Button>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}