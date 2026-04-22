// 'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Props {
  value: string;
  onChange: (value: 'all' | 'active' | 'archived') => void;
}

export default function ProductFilter({ value, onChange }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value as 'all' | 'active' | 'archived';
    onChange(selectedValue);

    const params = new URLSearchParams(searchParams.toString());
    if (selectedValue === 'all') {
  params.delete('status');
} else {
  params.set('status', selectedValue);
}
    params.set('page', '1');  
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Select
        value={value}
        onChange={handleFilterChange} 
        size="small"
        sx={{
          backgroundColor: 'white',
          borderColor: '#cbd5e1',
          '&:hover': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 1px #3b82f6',
          },
        }}
      > 
        <MenuItem value="active">Active Items</MenuItem>
        <MenuItem value="archived">Archived</MenuItem>
        <MenuItem value="all">All Products</MenuItem>
      </Select>
    </div>
  );
}