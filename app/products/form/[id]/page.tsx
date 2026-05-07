'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/productForm';
import { getProductById, updateProduct } from '@/app/services/productService';
import { checkPermission, getUserPermissions } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';
// import { useRoles } from '@/context/RoleContext';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token, hasPermission, loading } = useAuth();

  const [initialData, setInitialData] = useState<any>(null);

  // const token =
  //   typeof window !== 'undefined'
  //     ? localStorage.getItem('token')
  //     : null;

  // const { role, loading } = useRoles();

  useEffect(() => {
    if (!loading && !hasPermission('product:update')) {
      router.push('/products/crud');
    }
  }, [loading, hasPermission, router]);

  useEffect(() => {
    if (loading) return; 

    if (!id || !token) return;
    // const permissions = getUserPermissions(role);
    if (!hasPermission('product:update')) {
      router.replace('/products/crud');
    }
    const fetchData = async () => {
      const res = await getProductById(token, id);
      setInitialData(res);
    };

    fetchData();
  }, [id, token]);

  const handleSubmit = async (data: any) => {
    if (!hasPermission('product:update')) return;

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