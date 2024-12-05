/* eslint-disable */

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Backdrop,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateDoctype = () => {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [fieldTypes,setFieldType] = useState([])

  
  const selectedServer = useSelector((state) => state.server.selectedServer);
  const bearerToken  = localStorage.getItem('authToken')

  const [form, setForm] = useState({
    app: '',
    doc_type_name: '',
    is_child_table: 0,
    is_tree: 0,
    is_single: 0,
    is_submittable: 0,
    fields: [{ name: '', field_type: 'Data', label: '', permlevel: 0, options: null }],
  });

  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${selectedServer}/execute`, { fn: 'get_apps' },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      console.log(response.data.result);
      
      if (response.data && Array.isArray(response.data.result)) {
        setApps(response.data.result);
      } else {
        throw new Error('API response is not in the expected format');
      }
    } catch (err) {
      setError(err.message || 'Error fetching apps');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetch_datatypes = async () => {
    try {
      const response = await axios.post(`${selectedServer}/execute`, { fn: 'display_all_field_types' },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (response.data && Array.isArray(response.data.result)) {
        setFieldType(response.data.result);
      } else {
        throw new Error('API response is not in the expected format');
      }
    } catch (err) {
      setError(err.message || 'Error fetching apps');
    } finally {
      setLoading(false);
    }
  };

  


  useEffect(() => {
    if (!selectedServer) {
      setError('No server selected!');
      setShowError(true);
      return;
    }
    fetchApps();
    fetch_datatypes();
  }, [selectedServer,bearerToken]);


  const transformedApps = apps.map(app => {
    const [displayName, metadata] = Object.entries(app)[0];
    return { displayName, value: metadata.name };
  });
  
  
  const handleCheckboxChange = (key) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : 0,
    }));
  };

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: '', field_type: 'Data', label: '', permlevel: 0, options: null }],
    }));
  };

  const handleRemoveRow = (index) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleFieldEdit = (index, key, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index][key] = value;
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${selectedServer}/document`, form,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      console.log(response);
      console.log(response.data);
      console.log(response.data.status);
      
      if (response.data.status === 'success') {
        router.push('/dashboards/doctypelist');
      } else {
        throw new Error('Error submitting form');
      }
    } catch (err) {
      setError(err.message || 'Error submitting form');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <>
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ padding: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ position: 'relative' }}>
              {/* <Select
                value={form.app}
                onChange={(e) => handleFieldChange('app', e.target.value)}
                variant="outlined"
                fullWidth
                displayEmpty
                required
                sx={{ marginBottom: '8px' }}
              >
                <MenuItem value="" disabled>
                  Select or Enter an App
                </MenuItem>
                {apps.map((app, index) => (
                  <MenuItem key={index} value={app.id || app.name}>
                    {app}
                  </MenuItem>
                ))}
              </Select> */}
              <Select
                value={form.app}
                onChange={(e) => handleFieldChange('app', e.target.value)}
                variant="outlined"
                fullWidth
                displayEmpty
                required
                sx={{ marginBottom: '8px' }}
              >
                <MenuItem value="" disabled>
                  Select or Enter an App
                </MenuItem>
                {transformedApps.map((app, index) => (
                  <MenuItem key={index} value={app.value}>
                    {app.displayName}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                value={form.app}
                onChange={(e) => handleFieldChange('app', e.target.value)}
                label="Enter New App"
                variant="outlined"
                fullWidth
                sx={{ marginTop: '8px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="DocType Name"
              value={form.doc_type_name}
              onChange={(e) => handleFieldChange('doc_type_name', e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: '16px' }}>
          {['is_child_table', 'is_tree', 'is_single', 'is_submittable'].map((key, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={form[key] === 1}
                  onChange={() => handleCheckboxChange(key)}
                />
                <Typography>{key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          Fields
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Field Type</TableCell>
                <TableCell>Perm Level</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.fields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={field.label}
                      onChange={(e) => handleFieldEdit(index, 'label', e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={field.name}
                      onChange={(e) => handleFieldEdit(index, 'name', e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={field.field_type}
                      onChange={(e) => handleFieldEdit(index, 'field_type', e.target.value)}
                      size="small"
                      fullWidth
                    >
                      {fieldTypes.map((type, i) => (
                        <MenuItem key={i} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={field.permlevel}
                      onChange={(e) => handleFieldEdit(index, 'permlevel', parseInt(e.target.value) || 0)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={field.options || ''}
                      onChange={(e) => handleFieldEdit(index, 'options', e.target.value || null)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button startIcon={<AddIcon />} onClick={handleAddRow} variant="contained">
            Add Row
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateDoctype;
