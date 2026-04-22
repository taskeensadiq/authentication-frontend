'use client';

import ProductTable from '@/components/products/productTable';
import { useProducts } from '@/hooks/useProducts';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  toggleArchiveProduct,
  deleteProductPermanent
} from '@/app/services/productService';
import PaginationControls from '@/components/products/pagination'
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { checkPermission, useCurrentRole, getUserPermissions } from '@/lib/permissions';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const rawStatus = searchParams.get('status');
  const status = rawStatus === 'active' || rawStatus === 'archived' ? rawStatus : 'all';

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  const role = useCurrentRole();
  const permissions = getUserPermissions(role);

  const { products, setProducts, meta } = useProducts(page, limit, status);
  const totalPages = meta.totalPages;

  const [pageSize, setPageSize] = useState(limit);

  const handleDelete = async (id: string) => {
    if (!checkPermission(role, 'canDelete', 'delete products')) return;

    const product = products.find(p => p.id === id);
    if (!product) return;

    const confirmed = confirm(
      `Are you sure you want to permanently delete "${product.name}"?`
    );

    if (!confirmed) return;

    await deleteProductPermanent(token!, id);

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleArchive = async (id: string) => {
    if (!checkPermission(role, 'canArchive', 'archive or restore products')) return;

    const product = products.find(p => p.id === id);
    if (!product) return;

    const action = product.isArchived ? 'restore' : 'archive';

    const confirmed = confirm(`Are you sure you want to ${action} ${product.name}?`);
    if (!confirmed) return;

    const updated = await toggleArchiveProduct(token!, id);

    setProducts(prev =>
      prev.map(p => (p.id === id ? updated : p))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      <Grid container sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Grid item xs={12} md={7} sx={{
          display: 'flex', flexDirection: 'column', alignItems: {
            md: 'start',
            xs: 'center',
          }
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Product Management
          </Typography>
          <Typography variant="body2" sx={{
            color: '#64748b', pb: 2,
          }}>
            Manage your products, view analytics, and track inventory
          </Typography>
        </Grid>


        <Grid item xs={12} md={5} sx={{
          display: 'flex',
          justifyContent: {
            xs: 'center',
            md: 'flex-end',
          },
          gap: 2,
        }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              height: 50,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              color: '#ef4444',
              borderColor: '#ef4444',
              // mr: 2,
              // px: 3,
              // py: 1.5,
              '&:hover': {
                backgroundColor: '#fef2f2',
                borderColor: '#dc2626',
              },
            }}
          >
            Logout
          </Button>
          <Button
            disabled={!permissions.canCreate}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              if (checkPermission(role, 'canCreate', 'add products')) {
                router.push('/products/form');
              }
            }}
            sx={{
              height: 50,
              backgroundColor: permissions.canCreate ? '#3b82f6' : '#94a3b8',
              color: 'white',
              // px: 4,
              // py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: permissions.canCreate
                ? '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
                : 'none',
              '&:hover': {
                backgroundColor: permissions.canCreate ? '#2563eb' : '#94a3b8',
              },
              '&:active': {
                backgroundColor: permissions.canCreate ? '#1d4ed8' : '#94a3b8',
              }
            }}
          >
            Add Product
          </Button>
        </Grid>
      </Grid>


      <ProductTable
        products={products}
        onEdit={(product) => {
          if (checkPermission(role, 'canEdit', 'edit products')) {
            router.push(`/products/form/${product.id}`);
          }
        }}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
      />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          const params = new URLSearchParams();
          params.set('page', '1');
          params.set('limit', newSize.toString());
          if (status !== 'all') {
            params.set('status', status);
          }
          router.push(`${pathname}?${params.toString()}`);
        }
        }
        onChange={(newPage) => {
          const params = new URLSearchParams();
          params.set('page', newPage.toString());
          params.set('limit', limit.toString());
          if (status !== 'all') {
            params.set('status', status);
          }
          router.push(`${pathname}?${params.toString()}`);
        }}
      />
    </>
  );


}