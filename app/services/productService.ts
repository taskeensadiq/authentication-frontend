// const API_URL = 'http://localhost:4000/products';

// // const getAuthHeaders = (token: string) => ({
// //   Authorization: `Bearer ${token}`,
// //   'Content-Type': 'application/json',
// // });

// const getAuthHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// const handleResponse = async (res: Response) => {
//   if (!res.ok) {
//     const error = await res.json().catch(() => null);

//     if (res.status === 401) {
//       throw new Error('UNAUTHORIZED');
//     }

//     if (res.status === 403) {
//       throw new Error('FORBIDDEN');
//     }

//     throw new Error(error?.message || 'REQUEST_FAILED');
//   }

//   return res.json();
// };


// export const getProducts = async (
//   token: string,
//   params: { page?: number; limit?: number; status?: string }
// ) => {
//   const query = new URLSearchParams();

//   if (params.page) query.set('page', String(params.page));
//   if (params.limit) query.set('limit', String(params.limit));
//   if (params.status && params.status !== 'all') {
//     query.set('status', params.status);
//   }

//   const res = await fetch(`${API_URL}?${query.toString()}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error('Failed to fetch products');

//   return res.json();
// };

// export const createProduct = async (
//   token: string,
//   data: { name: string; description: string }
// ) => {
//   const res = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error('Create failed');

//   return res.json();
// };;

// export const updateProduct = async (
//   token: string,
//   id: string,
//   data: { name: string; description: string }
// ) => {
//   const res = await fetch(`${API_URL}/${id}`, {
//     method: 'PATCH',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error('Update failed');

//   return res.json();
// };
// export const toggleArchiveProduct = async (token: string, id: string) => {
//   const res = await fetch(`${API_URL}/${id}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error('Archive failed');

//   return res.json();
// };

// export const deleteProductPermanent = async (token: string, id: string) => {
//   const res = await fetch(`${API_URL}/${id}/permanent`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error('Delete failed');

//   return res.json();
// };

// export const getProductById = async (token: string, id: string) => {
//   const res = await fetch(`${API_URL}/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error('Fetch failed');

//   return res.json();
// };


const API_URL = 'http://localhost:4000/products';

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});
const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = {
      status: res.status,
      message: data?.message || 'REQUEST_FAILED',
    };

    throw error;
  }

  return data;
};
export const getProducts = async (
  token: string,
  params: { page?: number; limit?: number; status?: string }
) => {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') {
    query.set('status', params.status);
  }

  const res = await fetch(`${API_URL}?${query.toString()}`, {
    headers: getAuthHeaders(token),
  });

  return handleResponse(res);
};
export const createProduct = async (
  token: string,
  data: { name: string; description: string }
) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};
export const updateProduct = async (
  token: string,
  id: string,
  data: { name: string; description: string }
) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};
export const toggleArchiveProduct = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return handleResponse(res);
};
export const deleteProductPermanent = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}/permanent`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return handleResponse(res);
};
export const getProductById = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(token),
  });

  return handleResponse(res);
};