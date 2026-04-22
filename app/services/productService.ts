const API_URL = 'http://localhost:4000/products';

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getProducts = async (
  token: string,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  if (params.status && params.status !== "all") {
    query.set("status", params.status);  // This is the filter status
  }

  if (params.search) query.set("search", params.search);

  const url = `${API_URL}?${query.toString()}`;

  console.log("Fetching products with URL: ", url);  // Log URL for debugging

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`Error: ${res.status} - ${res.statusText}`); // Log the error response
    throw new Error('FETCH_FAILED');
  }

  return res.json();
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

  return res.json();
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

  return res.json();
};

export const toggleArchiveProduct = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return res.json();
};

export const deleteProductPermanent = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}/permanent`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return res.ok;
};

export const getProductById = async (token: string, id: string) => {
  const res = await fetch(`http://localhost:4000/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};