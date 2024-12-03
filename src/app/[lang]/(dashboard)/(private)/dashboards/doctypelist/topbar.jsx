/* eslint-disable */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Correct for App Router
import { Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const DocTypeHeader = ({ onFilterChange }) => {
  const router = useRouter(); // Initialize the router

  const handleAddClick = () => {
    router.push('/dashboards/doctypelist/createdoctype'); // Navigate to CreateDoctype page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Filter"
        onChange={(e) => onFilterChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start" size="small" disabled>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ width: '300px' }}
      />

      {/* Right side: Add DocType button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick} // Trigger navigation
        sx={{ textTransform: 'none' }}
      >
        Add DocType
      </Button>
    </Box>
  );
};

export default DocTypeHeader;
