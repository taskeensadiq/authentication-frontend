export const updateUserRoles = async (token: string, roles: string[]) => {
  const res = await fetch('http://localhost:4000/auth/roles', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roles }),
  });

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const message = body?.message || body || `Status ${res.status}`;
    throw new Error(`Failed to update roles: ${message}`);
  }

  return body;
};