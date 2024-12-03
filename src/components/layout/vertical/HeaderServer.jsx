'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectServer, addServer } from '@/redux-store/slices/server';
import { Box, Button, TextField, Select, MenuItem } from '@mui/material';

const ServerSelector = () => {
  const dispatch = useDispatch();
  const { servers, selectedServer } = useSelector((state) => state.server);
  const [newServer, setNewServer] = useState('');

  // Handle adding a new server
  const handleAddServer = () => {
    if (newServer.trim() && !servers.includes(newServer.trim())) {
      dispatch(addServer(newServer.trim()));
      dispatch(selectServer(newServer.trim())); // Automatically select the new server
      setNewServer('');
    }
  };

  // Handle selecting a server
  const handleSelectServer = (server) => {
    dispatch(selectServer(server));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
      <Select
        value={selectedServer || ''}
        onChange={(e) => handleSelectServer(e.target.value)}
        variant="outlined"
        displayEmpty
        sx={{ minWidth: '200px' }}
      >
        <MenuItem value="" disabled>
          Select a Server
        </MenuItem>
        {servers.map((server, index) => (
          <MenuItem key={index} value={server}>
            {server}
          </MenuItem>
        ))}
      </Select>
      <TextField
        value={newServer}
        onChange={(e) => setNewServer(e.target.value)}
        label="Add New Server"
        variant="outlined"
        sx={{ flexGrow: 1 }}
      />

      {/* Add server button */}
      <Button variant="contained" color="primary" onClick={handleAddServer}>
        Add
      </Button>
    </Box>
  );
};

export default ServerSelector;
