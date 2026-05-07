'use client';

import ProductTable from '@/components/products/productTable';
import { useProducts } from '@/hooks/useProducts';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  toggleArchiveProduct,
  deleteProductPermanent
} from '@/app/services/productService';
import { updateUserRoles } from '@/app/services/roleService';
import PaginationControls from '@/components/products/pagination'
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { checkPermission, getUserPermissions } from '@/lib/permissions';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import RoleModal from '@/app/role/page';
import CreateRoleModal from '@/app/role/create/page';
import { useAuth } from '@/context/AuthContext';


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

  // const { role, setRole } = useRoles();
  // const permissions = getUserPermissions(role);
  const { user, hasPermission, fetchWhoAmI } = useAuth();
  const permissions = user?.permissions || [];
  const [open, setOpen] = useState(false);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const { products, setProducts, meta } = useProducts(page, limit, status);
  const totalPages = meta.totalPages;

  const [pageSize, setPageSize] = useState(limit);

  // const handleDelete = async (id: string) => {

  //   if (!checkPermission(role, 'canDelete', 'delete products')) return;

  //   const product = products.find(p => p.id === id);
  //   if (!product) return;

  //   const confirmed = confirm(
  //     `Are you sure you want to permanently delete "${product.name}"?`
  //   );

  //   if (!confirmed) return;

  //   await deleteProductPermanent(token!, id);

  //   setProducts(prev => prev.filter(p => p.id !== id));
  // };

  const handleDelete = async (id: string) => {
    if (!hasPermission('product:delete')) return;

    const product = products.find(p => p.id === id);
    if (!product) return;

    const confirmed = confirm(
      `Are you sure you want to permanently delete "${product.name}"?`
    );

    if (!confirmed) return;

    await deleteProductPermanent(token!, id);

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // const handleToggleArchive = async (id: string) => {
  //   if (!checkPermission(role, 'canArchive', 'archive or restore products')) return;

  //   const product = products.find(p => p.id === id);
  //   if (!product) return;

  //   const action = product.isArchived ? 'restore' : 'archive';

  //   const confirmed = confirm(`Are you sure you want to ${action} ${product.name}?`);
  //   if (!confirmed) return;

  //   const updated = await toggleArchiveProduct(token!, id);

  //   setProducts(prev =>
  //     prev.map(p => (p.id === id ? updated : p))
  //   );
  // };

  // useEffect(() => {
  //   localStorage.setItem('role', JSON.stringify(role));
  //   console.log('Current role:', role);
  // }, [role]);

  const handleToggleArchive = async (id: string) => {
    if (!hasPermission('product:archive')) return;

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

          <Button variant="outlined" onClick={() => setOpen(true)} sx={{
            height: 50,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: 'white',
            color: '#3b82f6',
            borderColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#e0e7ff',
              borderColor: '#3b82f6',
            },
          }} >
            Role ({user?.roles?.length || 0})
          </Button>

          {hasPermission('role:create') && (
            <Button
              variant="outlined"
              onClick={() => setOpenCreateRole(true)}
              sx={{
                height: 50,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: 'white',
                color: '#10b981',
                borderColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#ecfdf5',
                  borderColor: '#10b981',
                },
              }}
            >
              Create Role
            </Button>
          )}

          <RoleModal
            open={open}
            currentRoles={user?.roles || []}
            onClose={() => setOpen(false)}
            onConfirm={async (selectedRoleIds) => {
              if (!token) {
                alert('Missing token');
                return;
              }

              try {
                const response = await updateUserRoles(token, selectedRoleIds);

                if (response?.access_token) {
                  localStorage.setItem('token', response.access_token);
                  // window.location.reload();
                }
                await fetchWhoAmI();
              } catch (error) {
                console.error(error);
                alert('Failed to update roles');
              }
            }}
          />

          <CreateRoleModal
            open={openCreateRole}
            onClose={() => setOpenCreateRole(false)}
            onSuccess={() => {
              // window.location.reload();
            }}
          />

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
              '&:hover': {
                backgroundColor: '#fef2f2',
                borderColor: '#dc2626',
              },
            }}
          >
            Logout
          </Button>
          {/* {permissions.canCreate && (
            <Button
              disabled={!permissions.canCreate}
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/products/form')}
              sx={{
                height: 50,
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
                ,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                '&:active': {
                  backgroundColor: '#1d4ed8',
                }
              }}
            >
              Add Product
            </Button>)} */}

          {hasPermission('product:create') && (
            // <Button
            //   variant="contained"
            //   startIcon={<AddIcon />}
            //   onClick={() => router.push('/products/form')}
            // >
            //   Add Product
            // </Button>


            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/products/form')}
              sx={{
                height: 50,
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
                ,
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                '&:active': {
                  backgroundColor: '#1d4ed8',
                }
              }}
            >
              Add Product
            </Button>
          )}

        </Grid>
      </Grid>


      <ProductTable
        products={products}
        // onEdit={(product) => {
        //   if (checkPermission(role, 'canEdit', 'edit products')) {
        //     router.push(`/products/form/${product.id}`);
        //   }
        // }}
        onEdit={(product) => {
          if (hasPermission('product:update')) {
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