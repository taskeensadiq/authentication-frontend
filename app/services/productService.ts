
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