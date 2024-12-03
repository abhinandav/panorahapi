'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Button,
  Box,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DataTable = ({ data, setData, columns, tableName }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const server = useSelector((state) => state.server.selectedServer);
  const { bearerToken } = useSelector((state) => state.auth);

  const handleSelectRow = (rowName) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowName)
        ? prevSelected.filter((name) => name !== rowName)
        : [...prevSelected, rowName]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.name));
    }
    setSelectAll(!selectAll);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      setError('No rows selected for deletion.');
      setShowError(true);
      return;
    }
  
    setLoading(true);
    try {
      const payload = {
        table_name:tableName, 
        payload: {
          name: selectedRows,
        },
      };
  
      const response = await axios.post(`${server}doctype/delete`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });
  
      if (response.data.status === 'Success') {
        const updatedData = data.filter((row) => !selectedRows.includes(row.name));
        setData(updatedData);
        setSelectedRows([]);
      } else {
        throw new Error(response.data.message || 'Failed to delete rows.');
      }
    } catch (error) {
      setError(error.message || 'Failed to delete rows.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  

  if (data.length === 0) {
    return <Typography variant="h6">No data available.</Typography>;
  }

  return (
    <Box>
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < data.length
                  }
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.name)}
                    onChange={() => handleSelectRow(row.name)}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b20000',
            },
          }}
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </Button>
      </Box>
    </Box>
  );
};

export default DataTable;
