'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
interface Permission {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoleModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { fetchWhoAmI } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        localStorage.getItem('user');
        if (!token) {
          setError('Missing token');
          return;
        }

        const res = await fetch('http://localhost:4000/roles/permissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load permissions: ${res.status}`);
        }

        const data = await res.json();
        setPermissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Permission fetch failed', err);
        setError('Failed to load permissions');
      }
    };

    fetchPermissions();
  }, [open]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    );
  };

  const handleCreate = async () => {
    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }

    if (selectedPermissions.length === 0) {
      setError('At least one permission is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Missing token');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:4000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roleName.toUpperCase(),
          permissionIds: selectedPermissions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Failed to create role: ${res.status}`);
      }

      setRoleName('');
      setSelectedPermissions([]);
      onSuccess();
      onClose();
      fetchWhoAmI(token);
    } catch (err: any) {
      console.error('Role creation failed', err);
      setError(err.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoleName('');
    setSelectedPermissions([]);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Role</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          fullWidth
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="e.g., MANAGER"
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
            Select Permissions
          </Box>

          {permissions.length === 0 ? (
            <Box sx={{ fontSize: '0.875rem', color: '#666' }}>
              No permissions available
            </Box>
          ) : (
            permissions.map((perm) => (
              <FormControlLabel
                key={perm.id}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    disabled={loading}
                  />
                }
                label={perm.name}
              />
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={loading || !roleName.trim() || selectedPermissions.length === 0}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
