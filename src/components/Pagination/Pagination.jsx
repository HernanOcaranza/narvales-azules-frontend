import React from 'react';
import { Box, Pagination as MuiPagination, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (event) => {
    if (onLimitChange) {
      onLimitChange(event.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        gap: 2,
        p: 2,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Total: {pagination.total} registros
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="page-size-label">Por página</InputLabel>
          <Select
            labelId="page-size-label"
            value={pagination.limit}
            label="Por página"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        
        <MuiPagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default Pagination;