'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { createProduct } from '@/app/services/productService';
import { use, useEffect } from 'react';
import { checkPermission, getUserPermissions } from '@/lib/permissions';
import { useRoles } from '@/context/RoleContext';

export default function CreateProductPage() {
  const router = useRouter();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const { role, loading } = useRoles();

  useEffect(() => {
    if (role !== null && !checkPermission(role, 'canCreate', 'add products')) {
      router.push('/products/crud');
    }
  }, [role, router]);

  // if (loading) return <div>Loading...</div>;
  if (loading || role === null) {
    return <div>Loading...</div>;
  }

  const permissions = getUserPermissions(role);

  if (!permissions?.canCreate) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    if (!checkPermission(role, 'canCreate', 'add products')) return;

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