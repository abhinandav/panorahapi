/* eslint-disable */

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import {
  Box,
  Button,
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
  Modal,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { token } from 'stylis';


const EditDoctype = ({ app, doctype }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    field_type: 'Data',
    label: '',
    permlevel: 0,
    options: null,
  });

  
  const server = useSelector((state) => state.server.selectedServer);
  const { bearerToken } = useSelector((state) => state.auth);

  const fieldTypes = [
    'Data',
    'Text',
    'Autocomplete',
    'Attach',
    'AttachImage',
    'Barcode',
    'Check',
    'Code',
    'Color',
    'Currency',
    'Date',
    'Datetime',
    'Duration',
    'DynamicLink',
    'Float',
    'HTMLEditor',
    'Int',
    'JSON',
    'Link',
    'LongText',
    'MarkdownEditor',
    'Password',
    'Percent',
    'Phone',
    'ReadOnly',
    'Rating',
    'Select',
    'SmallText',
    'TextEditor',
    'Time',
    'Table',
    'TableMultiSelect',
  ];

  useEffect(() => {
    if (!app || !doctype) {
      setError('Missing required parameters.');
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${server}getjson/${app}/${doctype}`,{
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        const metadata = response.data;
        console.log(metadata.data);
        
        setForm({
          ...metadata,
          fields: metadata.data.fields || [],
        });
      } catch (err) {
        setError('Failed to fetch metadata.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [app, doctype,bearerToken, server]);

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveRow = async (index) => {
    setOperationLoading(true);
    try {
      const fieldToDelete = form.fields[index];
      const payload = { table_name: doctype, column_name: fieldToDelete.name };
      await axios.put(`${server}/alter/table/delete`, payload,{
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setForm((prev) => ({
        ...prev,
        fields: prev.fields.filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error('Failed to delete field:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleFieldEdit = (index, key, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index][key] = value;
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleNewFieldChange = (key, value) => {
    setNewField((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddField = async () => {
    setOperationLoading(true);
    try {
      const payload = {
        table_name: doctype,
        column_name: newField.name,
        field_type: newField.field_type,
        label: newField.label,
      };
      await axios.put(`${server}/alter/table/add`, payload,{
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      setForm((prev) => ({
        ...prev,
        fields: [...prev.fields, newField],
      }));
      handleCloseModal();
      setNewField({ name: '', field_type: 'Data', label: '', permlevel: 0, options: null });
    } catch (err) {
      console.error('Failed to add field:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSubmit = async () => {
    setOperationLoading(true);
    try {
      console.log('Edited Form Data:', form);
    } catch (err) {
      console.error('Failed to submit data:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="App"
            value={app}
            onChange={(e) => handleFieldChange('app', e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="DocType Name"
            value={doctype}
            onChange={(e) => handleFieldChange('doc_type_name', e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
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
                  <TextField
                    value={field.field_type || 'Data'}
                    onChange={(e) => handleFieldEdit(index, 'field_type', e.target.value)}
                    size="small"
                  />
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
                  <IconButton onClick={() => handleRemoveRow(index)} disabled={operationLoading}>
                    {operationLoading && index === form.fields.length - 1 ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          variant="contained"
          disabled={operationLoading}
        >
          {operationLoading ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 'Add Row'}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={operationLoading}>
          {operationLoading ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 'Submit'}
        </Button>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New Field
          </Typography>
          <TextField
            label="Name"
            value={newField.name}
            onChange={(e) => handleNewFieldChange('name', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Label"
            value={newField.label}
            onChange={(e) => handleNewFieldChange('label', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            value={newField.field_type}
            onChange={(e) => handleNewFieldChange('field_type', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {fieldTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Options"
            value={newField.options}
            onChange={(e) => handleNewFieldChange('options', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddField} fullWidth disabled={operationLoading}>
            {operationLoading ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 'Add Field'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EditDoctype;
