'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBearerToken } from '@/redux-store/slices/auth';
import { Box, TextField, Button, Typography } from '@mui/material';

const BearerTokenForm = () => {
  const dispatch = useDispatch();
  const { bearerToken } = useSelector((state) => state.auth); // Access Bearer Token from Redux
  const [inputToken, setInputToken] = useState(bearerToken || ''); // Local state for input

  const handleSaveToken = () => {
    if (inputToken.trim()) {
      dispatch(setBearerToken(inputToken.trim()));
    }
  };

  return (<>
    <Box sx={{ padding: '16px',borderBottom: '1px solid #e0e0e0'}}>
      <TextField
        label="Bearer Token"
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
        variant="outlined"
        fullWidth
        multiline
        rows={1}
        sx={{ marginBottom: '16px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveToken}
        fullWidth
      >
        Save Token
      </Button>
    </Box>
    
  </>);
};

export default BearerTokenForm;
