import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'editor' | 'user';

export interface PermissionCheck {
  canCreate: boolean;
  canEdit: boolean;
  canArchive: boolean;
  canDelete: boolean;
}

export const getUserPermissions = (role: UserRole[]): PermissionCheck => {
  return {
    canCreate: role.includes('admin') || role.includes('editor'),
    canEdit: role.includes('admin') || role.includes('editor'),
    canArchive: role.includes('admin'),
    canDelete: role.includes('admin'),
  };
};

export const checkPermission = (
  role: UserRole[],
  operation: keyof PermissionCheck,
  operationName: string
): boolean => {
  const permissions = getUserPermissions(role);

  if (!permissions[operation]) {
        return false;
  }

  return true;
};

export const useCurrentRole = (): { role: UserRole[]; loading: boolean } => {
  const [role, setRole] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('role');

      const parsed =
        stored && stored !== 'undefined'
          ? JSON.parse(stored)
          : [];

      setRole(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRole([]);
    } finally {
      setLoading(false); 
    }
  }, []);

  return { role, loading };
};