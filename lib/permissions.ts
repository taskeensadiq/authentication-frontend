import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'editor' | 'user' | null;

export interface PermissionCheck {
  canCreate: boolean;
  canEdit: boolean;
  canArchive: boolean;
  canDelete: boolean;
}

export const getUserPermissions = (role: UserRole): PermissionCheck => {
  return {
    canCreate: role === 'admin' || role === 'editor',
    canEdit: role === 'admin' || role === 'editor',
    canArchive: role === 'admin',
    canDelete: role === 'admin',
  };
};

export const checkPermission = (
  role: UserRole,
  operation: keyof PermissionCheck,
  operationName: string
): boolean => {
  const permissions = getUserPermissions(role);

  if (!permissions[operation]) {
    // if (typeof window !== 'undefined') {
      alert(`You do not have permission to ${operationName}.`);
    // }
    return false;
  }

  return true;
};

export const useCurrentRole = (): UserRole => {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role') as UserRole;
    setRole(storedRole);
  }, []);

  return role;
};