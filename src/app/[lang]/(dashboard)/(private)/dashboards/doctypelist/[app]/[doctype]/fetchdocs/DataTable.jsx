/* eslint-disable */

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
  Modal,
  TextField,
} from '@mui/material';
import axios from 'axios';

const DataTable = ({ app, doctype, data, setData, columns, tableName }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [originalRowData, setOriginalRowData] = useState(null);

  const server = typeof window !== 'undefined' ? localStorage.getItem('server') || '' : '';
  const bearerToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') || '' : '';

  const handleCloseError = () => setShowError(false);

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

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      setError('No rows selected for deletion.');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        table_name: tableName,
        payload: {
          name: selectedRows,
        },
      };

      const response = await axios.post(`${server}doctype/${app}/${doctype}/delete`, payload, {
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
      setError(error.response?.data?.message || error.message || 'Failed to delete rows.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const changedValues = Object.keys(editRowData).reduce((acc, key) => {
        if (editRowData[key] !== originalRowData[key]) {
          acc[key] = editRowData[key];
        }
        return acc;
      }, {});

      if (Object.keys(changedValues).length === 0) {
        setError('No changes detected.');
        setShowError(true);
        setLoading(false);
        return;
      }

      const payload = {
        payload: changedValues,
        condition_dict: { name: originalRowData.name },
      };

      const response = await axios.put(`${server}doctype/${app}/${doctype}/update`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response.data.status === 'Success') {
        const updatedData = data.map((row) =>
          row.name === originalRowData.name ? { ...row, ...changedValues } : row
        );
        setData(updatedData);
        setOpenEditModal(false);
      } else {
        throw new Error(response.data.message || 'Failed to update row.');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to update row.');
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
              <TableCell>Actions</TableCell>
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
                  <TableCell key={col}>{row[col] || 'N/A'}</TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setOriginalRowData(row);
                      setEditRowData(row);
                      setOpenEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
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

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Row
          </Typography>
          {columns.map((col) => (
            <TextField
              key={col}
              label={col}
              value={editRowData ? editRowData[col] || '' : ''}
              onChange={(e) =>
                setEditRowData((prev) => ({ ...prev, [col]: e.target.value }))
              }
              fullWidth
              margin="normal"
            />
          ))}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleEditSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DataTable;
