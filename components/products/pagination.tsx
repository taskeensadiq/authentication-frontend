'use client';

import { MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';

interface Props {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
  pageSize: number;
  onPageSizeChange: (newSize: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  onChange,
  pageSize,
  onPageSizeChange

}: Props) {
  return (
    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end', mb: 2 }}>

      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">Rows per page:</Typography>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            size="small"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Stack>
      </Grid>

      <Grid item>
        <Stack alignItems="center" >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Page {page} of {totalPages}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => onChange(value)}
            color="primary"
          />
        </Stack>
      </Grid>

    </Grid>
  );
}