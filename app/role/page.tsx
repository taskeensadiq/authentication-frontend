
'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Role {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  currentRoles: string[]; 
  onClose: () => void;
  onConfirm: (roleIds: string[]) => void;
}

export default function RoleModal({
  open,
  currentRoles,
  onClose,
  onConfirm,
}: Props) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const { fetchWhoAmI } = useAuth();

  useEffect(() => {
    if (!open) return;

    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setAvailableRoles([]);
          return;
        }

        const res = await fetch('http://localhost:4000/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load roles: ${res.status}`);
        }

        const data = await res.json();
        setAvailableRoles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Role fetch failed', error);
        setAvailableRoles([]);
      }
    };

    fetchRoles();
  }, [open]);

  useEffect(() => {
    if (!open || availableRoles.length === 0) return;

    const normalizedCurrent = currentRoles.map((role) => String(role).toLowerCase());
    setSelected(
      availableRoles
        .filter((role) => normalizedCurrent.includes(role.name.toLowerCase()))
        .map((role) => role.id)
    );
  }, [open, currentRoles, availableRoles]);

  // const toggleRole = (roleName: string) => {
  //   setSelected((prev) =>
  //     prev.includes(roleName)
  //       ? prev.filter((r) => r !== roleName)
  //       : [...prev, roleName]
  //   );
  // };

  const toggleRole = (roleId: string) => {
    setSelected((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleConfirm = async () => {

    //    localStorage.setItem(
    //   'roles',
    //   JSON.stringify(
    //     availableRoles
    //       .filter(r => selected.includes(r.id))
    //       .map(r => r.name)
    //   )
    // );
    await onConfirm(selected.length > 0 ? selected : []);
    // await fetchWhoAmI();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Roles</DialogTitle>

      <DialogContent>
        {/* {availableRoles.map((role) => (
          <FormControlLabel
            key={role.id}
            control={
              <Checkbox
                checked={selected.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
            }
            label={role.name}
          />
        ))} */}

        {availableRoles
  .filter((role) => role.name !== 'SUPER_ADMIN')
  .map((role) => (
    <FormControlLabel
      key={role.id}
      control={
        <Checkbox
          checked={selected.includes(role.id)}
          onChange={() => toggleRole(role.id)}
        />
      }
      label={role.name}
    />
))}

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleConfirm}   disabled={selected.length === 0}
>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}