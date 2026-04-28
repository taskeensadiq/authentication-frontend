'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { getProductById, updateProduct } from '@/app/services/productService';
import { checkPermission, getUserPermissions } from '@/lib/permissions';
import { useRoles } from '@/context/RoleContext';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [initialData, setInitialData] = useState<any>(null);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const { role, loading } = useRoles();

  useEffect(() => {
    if (role !== null && !checkPermission(role, 'canEdit', 'edit products')) {
      router.push('/products/crud');
    }
  }, [role, router]);

  useEffect(() => {
    if (loading) return; 

    if (!id || !token) return;
    const permissions = getUserPermissions(role);
    if (!permissions?.canEdit) {
      router.replace('/products/crud');
    }
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