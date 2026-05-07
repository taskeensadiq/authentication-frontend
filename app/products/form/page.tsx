'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { createProduct } from '@/app/services/productService';
import { use, useEffect } from 'react';
import { checkPermission, getUserPermissions } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';
// import { useRoles } from '@/context/RoleContext';

export default function CreateProductPage() {
  const router = useRouter();
  const { token, hasPermission, loading } = useAuth();

  // const token =
  //   typeof window !== 'undefined'
  //     ? localStorage.getItem('token')
  //     : null;

  // const { role, loading } = useRoles();

  useEffect(() => {
    if (!loading && !hasPermission('product:create')) {
      router.push('/products/crud');
    }
  }, [loading, hasPermission, router]);

  // if (loading) return <div>Loading...</div>;
  if (loading) {
    return <div>Loading...</div>;
  }

  // const permissions = getUserPermissions(role);

  if (!hasPermission('product:create')) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    if (!hasPermission('product:create')) return;

    await createProduct(token!, data);
    router.push('/products/crud');
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onCancel={() => router.push('/products/crud')}
    />
  );
}