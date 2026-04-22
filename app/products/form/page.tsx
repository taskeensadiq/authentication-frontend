'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { createProduct } from '@/app/services/productService';
import { useEffect } from 'react';
import { checkPermission, useCurrentRole } from '@/lib/permissions';

export default function CreateProductPage() {
  const router = useRouter();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const role = useCurrentRole();

  useEffect(() => {
    if (role !== null && !checkPermission(role, 'canCreate', 'add products')) {
      router.push('/products/crud');
    }
  }, [role, router]);

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