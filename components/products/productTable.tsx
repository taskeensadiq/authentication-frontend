'use client';

import {
  Table, TableBody, TableCell,
  TableHead, TableRow, IconButton,
  Grid,
  TableContainer,
  Paper
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';

import ProductFilter from './filter';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Product } from '@/app/types/product';
import { checkPermission, useCurrentRole } from '@/lib/permissions';

interface ProductTableProps {
  onEdit: (product: Product) => void;
  products: Product[];
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}
export default function ProductTable({ onEdit, products = [], onToggleArchive, onDelete }: ProductTableProps) {
  const searchParams = useSearchParams();
  const viewFilter = (searchParams.get('status') as 'all' | 'active' | 'archived') || 'all';

  const role = useCurrentRole();

  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (newFilter: 'all' | 'active' | 'archived') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (newFilter === 'all') {
      params.delete('status');
    } else {
      params.set('status', newFilter);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const getLastActivity = (p: Product) => {
    const created = new Date(p.createdAt).getTime();
    const updated = new Date(p.updatedAt).getTime();
    const archived = p.archivedAt ? new Date(p.archivedAt).getTime() : null;

    let label = "Created";
    let color = "#64748b";
    let date = created;

    if (p.justRestored) {
      label = "Restored";
      color = "#16a34a";
      date = updated;
    }
    else if (p.isArchived && archived) {
      label = "Archived";
      color = "#dc2626";
      date = archived;
    }
    else if (Math.abs(updated - created) > 2000) {
      label = "Modified";
      color = "#d97706";
      date = updated;
    }

    const d = new Date(date);

    return {
      label,
      color,
      formatted: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
    };
  };

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


  return (
    <>

      <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, }}>
        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ProductFilter value={viewFilter} onChange={handleFilterChange} />
        </Grid>
      </Grid>

      {products.length === 0 ? (
        <div style={{ padding: 40 }}>Loading...</div>
      ) : (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Activity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((product) => {
                    const activity = getLastActivity(product);

                    return (
                      <TableRow key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{product.name}</TableCell>

                        <TableCell>
                          {product.description || 'No description'}
                        </TableCell>

                        <TableCell>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13 }}>
                              {activity.formatted}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: activity.color,
                                textTransform: 'uppercase'
                              }}
                            >
                              {activity.label}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell align="right">
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>

                            {!product.isArchived ? (
                              <>
                                <IconButton
                                  onClick={() => {
                                    if (checkPermission(role, 'canEdit', 'edit products')) {
                                      onEdit(product);
                                    }
                                  }}
                                  sx={{ backgroundColor: '#ecdec7', color: '#d97706' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                  onClick={() => {
                                    if (checkPermission(role, 'canArchive', 'archive products')) {
                                      onToggleArchive(product.id);
                                    }
                                  }}
                                  sx={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  onClick={() => {
                                    if (checkPermission(role, 'canArchive', 'restore products')) {
                                      onToggleArchive(product.id);
                                    }
                                  }}
                                  sx={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                                >
                                  <RestoreIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                  onClick={() => {
                                    if (checkPermission(role, 'canDelete', 'delete products')) {
                                      onDelete(product.id);
                                    }
                                  }}
                                  sx={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}

                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>
              </Table>
            </TableContainer>

          </Grid>
        </Grid>
      )}
    </>
  );
}