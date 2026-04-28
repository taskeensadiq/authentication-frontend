'use client';

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
import { UserRole } from '@/lib/permissions';

const AVAILABLE_ROLES: UserRole[] = ['admin', 'editor', 'user'];

interface Props {
  open: boolean;
  currentRoles: UserRole[];
  onClose: () => void;
  onConfirm: (role: UserRole[]) => void;
}

export default function RoleModal({
  open,
  currentRoles,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<UserRole[]>([]);

  useEffect(() => {
    if (open) {
      setSelected(currentRoles || []);
    }
  }, [open, currentRoles]);

  const toggleRole = (role: UserRole) => {
    setSelected((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Roles</DialogTitle>

      <DialogContent>
        {AVAILABLE_ROLES.map((role) => (
          <FormControlLabel
            key={role}
            control={
              <Checkbox
                checked={selected.includes(role)}
                onChange={() => toggleRole(role)}
              />
            }
            label={role}
          />
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}