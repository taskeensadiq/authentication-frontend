'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { getProductById, updateProduct } from '@/app/services/productService';
import { checkPermission, useCurrentRole } from '@/lib/permissions';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [initialData, setInitialData] = useState<any>(null);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const role = useCurrentRole();

  useEffect(() => {
    if (role !== null && !checkPermission(role, 'canEdit', 'edit products')) {
      router.push('/products/crud');
    }
  }, [role, router]);

  useEffect(() => {
    if (!id || !token) return;

    const fetchData = async () => {
      const res = await getProductById(token, id);
      setInitialData(res);
    };

    fetchData();
  }, [id, token]);

  const handleSubmit = async (data: any) => {
    if (!checkPermission(role, 'canEdit', 'edit products')) return;

    await updateProduct(token!, id, data);
    router.push('/products/crud');
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <ProductForm
      editingProduct={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/products/crud')}
    />
  );
}