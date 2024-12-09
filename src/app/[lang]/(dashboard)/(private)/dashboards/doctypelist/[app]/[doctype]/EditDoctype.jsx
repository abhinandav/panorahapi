/* eslint-disable */

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
  Modal,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Checkbox } from '@mui/material';
import { patch } from '@mui/material';

const EditDoctype = ({ app, doctype }) => {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [fieldTypes, setFieldType] = useState([]);
  const [editLabelModalOpen, setEditLabelModalOpen] = useState(false);
  const [editedLabel, setEditedLabel] = useState('');
  const [changeOrderModalOpen, setChangeOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    field_type: 'Data',
    label: '',
    permlevel: 0,
    options: null,
  });

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken = localStorage.getItem('authToken');




  const fetchMetadata = async () => {
    try {
      const response = await axios.get(`${server}doctype/${app}/${doctype}/getjson`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const metadata = response.data;
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

  useEffect(()=>{
    fetchMetadata()
  },[server])

  useEffect(() => {
    if (!app || !doctype) {
      setError('Missing required parameters.');
      setLoading(false);
      return;
    }

    const fetchDatatypes = async () => {
      try {
        const response = await axios.post(
          `${server}/execute`,
          { fn: 'display_all_field_types' },
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
        setError(err.message || 'Error fetching field types');
      } finally {
        setLoading(false);
      }
    };
    fetchDatatypes();
  }, [app, doctype, bearerToken, server]);


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


  const handleMenuOpen = (event, index) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedFieldIndex(index);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedFieldIndex(null);
  };



  // add field
  const handleAddField = async () => {
    setOperationLoading(true);
    try {
      const payload = {
        table_name: doctype,
        column_name: newField.name,
        field_type: newField.field_type,
        label: newField.label,
      };
      await axios.put(`${server}/alter/table/add`, payload, {
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



  // remove field
  const handleRemoveRow = async (index) => {
    setLoading(true);
    try {
      const fieldToDelete = form.fields[index];
      const payload = { table_name: doctype, column_name: fieldToDelete.name };
      await axios.put(`${server}/alter/table/delete`, payload, {
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
      setLoading(false);
    }
  };

  const handleDeleteField = async () => {
    if (selectedFieldIndex === null) return;
    await handleRemoveRow(selectedFieldIndex);
    handleMenuClose();
  };



  // edit label
  const handleEditLabel = () => {
    if (selectedFieldIndex === null) return;
    const selectedField = form.fields[selectedFieldIndex];
    setEditedLabel(selectedField.label); // Pre-fill the label
    setEditLabelModalOpen(true);
  };

  const handleEditLabelSubmit = async () => {
    if (selectedFieldIndex === null) return;

    const payload= { 
      table_name: doctype, 
      current_column: form.fields[selectedFieldIndex].name, 
      new_label: editedLabel 
    }

    console.log(payload);
    
  
    try {
      await axios.put(`${server}alter/table/renamelabel`,payload , {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      handleFieldEdit(selectedFieldIndex, 'label', editedLabel);
      setEditLabelModalOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to edit label:', error);
    }
  };
  

  // change order

  const handleChangeOrder = () => {
    if (selectedFieldIndex === null) return;
    const selectedField = form.fields[selectedFieldIndex];
    setNewOrder(selectedField.order || 0); // Pre-fill with current order or default to 0
    setChangeOrderModalOpen(true);
  };

  const handleChangeOrderSubmit = async () => {
    if (selectedFieldIndex === null) return;
    console.log('work');
    
  
    try {
      const selectedField = form.fields[selectedFieldIndex];
      const payload = {
        field_name: selectedField.name,
        order: newOrder,
      };
  
      await axios.put(
        `${server}/doctype/${app}/${doctype}/update/order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
        handleFieldEdit(selectedFieldIndex, 'order', newOrder);
        fetchMetadata();
  
      setChangeOrderModalOpen(false);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to change order:', error);
    }
  };


  // delete doctype
  const handleDeleteDocType = async () => {
    if (!doctype) {
      console.error("No DocType specified for deletion.");
      return;
    }
    setDeleteLoading(true);
    try {
      const response = await axios.delete(`${server}/document/delete/${doctype}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response.status === 200) {
        alert(`DocType '${doctype}' deleted successfully.`);
        router.push('/dashboards/doctypelist');
      } else {
        console.error(`Failed to delete DocType: ${response.data.message}`);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting DocType:", error);
      alert("Error deleting DocType. Check the console for details.");
    } finally {
      setDeleteLoading(false);
    }
  };


  const handleFetchRoute = () => {
    router.push(`/dashboards/doctypelist/${app}/${doctype}/fetchdocs`);
  };

  const handleInsertRoute = () => {
    router.push(`/dashboards/doctypelist/${app}/${doctype}/insertdata`);
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
       <Grid container spacing={2} alignItems="center" style={{ marginBottom: '24px' }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="App Name"
                name="app_name"
                value={app}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Table Name"
                name="table_name"
                value={doctype}
                required
              />
            </Grid>
          </Grid>


          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box>
                <Checkbox
                  checked={form?.data?.is_tree === 1}
                  disabled 
                />
                <label>Is Tree</label>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box>
                <Checkbox
                  checked={form?.data?.is_child_table === 1}
                  disabled
                />
                <label>Is Child Table</label>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box>
                <Checkbox
                  checked={form?.data?.is_single === 1}
                  disabled 
                />
                <label>Is Single</label>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box>
                <Checkbox
                  checked={form?.data?.is_submittable === 1} 
                  disabled 
                />
                <label>Is Submittable</label>
              </Box>
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
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={field.name}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={field.field_type || 'Data'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={field.permlevel}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={field.options || ''}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl) && selectedFieldIndex === index}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDeleteField}>Delete</MenuItem>
                    <MenuItem onClick={handleEditLabel}>Edit Label</MenuItem>
                    <MenuItem onClick={handleChangeOrder}>Change Order</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <Box>
          <Button startIcon={<AddIcon />} onClick={handleOpenModal} variant="contained">
            Add Row
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Button onClick={handleFetchRoute} variant="contained">
            Fetch Data
          </Button>

          <Button onClick={handleInsertRoute} variant="contained">
            Insert Data
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteDocType}
            disabled={deleteLoading}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete DocType"}
          </Button>
        </Box>
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
          <TextField
            label="Field Type"
            value={newField.field_type}
            onChange={(e) => handleNewFieldChange('field_type', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
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

      <Modal
        open={editLabelModalOpen}
        onClose={() => setEditLabelModalOpen(false)}
        aria-labelledby="edit-label-modal-title"
        aria-describedby="edit-label-modal-description"
      >
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
            width: '400px',
          }}
        >
          <Typography id="edit-label-modal-title" variant="h6" mb={2}>
            Edit Label
          </Typography>
          <TextField
            id="edit-label-modal-description"
            label="New Label"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => setEditLabelModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleEditLabelSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={changeOrderModalOpen}
        onClose={() => setChangeOrderModalOpen(false)}
        aria-labelledby="change-order-modal-title"
        aria-describedby="change-order-modal-description"
      >
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
            width: '400px',
          }}
        >
          <Typography id="change-order-modal-title" variant="h6" mb={2}>
            Change Order
          </Typography>
          <TextField
            id="change-order-modal-description"
            label="New Order"
            type="text"
            value={newOrder}
            onChange={(e) => setNewOrder(parseInt(e.target.value, 10) || 0)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => setChangeOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleChangeOrderSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>


    </Box>
  );
};

export default EditDoctype;
