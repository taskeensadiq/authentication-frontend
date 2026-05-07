// import { useEffect, useState } from 'react';
// import { getProducts } from '../app/services/productService';
// import { Product } from '../app/types/product'


// export const useProducts = (page: number, limit: number, status: string) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
//   const [loading, setLoading] = useState(true);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const query =
//           status === 'all'
//             ? { page, limit }       
//             : { status, page, limit };

//         const data = await getProducts(token!, query);

//         setProducts(data.data);
//         setMeta({
//           total: data.total,
//           totalPages: data.totalPages,
//         });
//         console.log('Fetched products:', data.data);
//         console.log('Meta:', data.total, data.totalPages);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, limit, status]);

//   return { products, setProducts, meta, loading };
// };


import { useEffect, useState } from 'react';
import { getProducts } from '../app/services/productService';
import { Product } from '../app/types/product';
import { useRouter } from 'next/navigation';

export const useProducts = (page: number, limit: number, status: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);

      try {
        const query =
          status === 'all'
            ? { page, limit }
            : { status, page, limit };

        const data = await getProducts(token, query);

        setProducts(data.data);
        setMeta({
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (err: any) {
        console.error(err);

        if (err.message === 'UNAUTHORIZED') {
          localStorage.removeItem('token');
          router.push('/login');
        }

        if (err.message === 'FORBIDDEN') {
          setProducts([]);
          alert('You do not have permission to view products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, status, token]);

  return { products, setProducts, meta, loading };
};