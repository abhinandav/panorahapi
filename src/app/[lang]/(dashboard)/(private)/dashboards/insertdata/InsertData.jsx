/* eslint-disable */

'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Modal,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const InsertField = () => {
  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken  = localStorage.getItem('authToken')
  

  const [formData, setFormData] = useState({
    table_name: '',
    payload: {},
  });

  const [payloadEntries, setPayloadEntries] = useState([{ key: '', value: '' }]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    appname: '',
    doctype_name: '',
    file: null,
  });
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayloadChange = (index, field, value) => {
    const updatedPayloadEntries = [...payloadEntries];
    updatedPayloadEntries[index][field] = value;
    setPayloadEntries(updatedPayloadEntries);
    const updatedPayload = {};
    updatedPayloadEntries.forEach((entry) => {
      if (entry.key) {
        updatedPayload[entry.key] = entry.value;
      }
    });
    setFormData((prev) => ({
      ...prev,
      payload: updatedPayload,
    }));
  };

  const addPayloadEntry = () => {
    setPayloadEntries([...payloadEntries, { key: '', value: '' }]);
  };

  const removePayloadEntry = (index) => {
    const updatedPayloadEntries = payloadEntries.filter((_, i) => i !== index);
    setPayloadEntries(updatedPayloadEntries);
    const updatedPayload = {};
    updatedPayloadEntries.forEach((entry) => {
      if (entry.key) {
        updatedPayload[entry.key] = entry.value;
      }
    });
    setFormData((prev) => ({
      ...prev,
      payload: updatedPayload,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      table_name: formData.table_name,
      payload: payloadEntries.reduce((acc, entry) => {
        if (entry.key && entry.value) {
          acc[entry.key] = entry.value;
        }
        return acc;
      }, {}),
    };
    try {
      const response = await axios.post(`${server}/doctype/add`, data, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      if (response.data.status === "Success") {
        setPayloadEntries([{ key: '', value: '' }])
        alert("Data Inserted")
      }
    } catch (error) {
      console.error(error);
      alert(error)
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
  
    const formData = new FormData();
    formData.append('data', bulkForm.file);

      for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  


    try {
      console.log(formData);
      const response = await axios.post(
        `${server}/doctype/bulk_insert?app=${bulkForm.appname}&doctype_name=${bulkForm.doctype_name}`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
  
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        setResponseData({ error: `Unexpected response status: ${response.status}` });
      }
    } catch (error) {
      console.error('Error during bulk insert:', error.response?.data || error.message);
      setResponseData({ error: error.response?.data || error.message });
    } finally {
      setBulkLoading(false);
      setBulkModalOpen(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid container spacing={2} style={{ marginBottom: '24px' }}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label="Table Name"
                name="table_name"
                value={formData.table_name}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          {payloadEntries.map((entry, index) => (
            <Grid container spacing={2} key={index} alignItems="center" style={{ marginBottom: '16px' }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Key"
                  value={entry.key}
                  onChange={(e) => handlePayloadChange(index, 'key', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Value"
                  value={entry.value}
                  onChange={(e) => handlePayloadChange(index, 'value', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="error" onClick={() => removePayloadEntry(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addPayloadEntry} style={{ marginRight: '8px' }}>
              Add Entry
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setBulkModalOpen(true)} style={{ marginLeft: '8px' }}>
              Bulk Insert
            </Button>
          </Grid>
        </Grid>
      </form>

      <Modal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)}>
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
            width: '400px', // Adjust size for better alignment
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Bulk Insert
          </Typography>

          {/* Show Loading Spinner During Submission */}
          {bulkLoading ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={40} />
              <Typography sx={{ mt: 2 }}>Processing...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleBulkSubmit}>
              <TextField
                fullWidth
                label="App Name"
                name="appname"
                value={bulkForm.appname}
                onChange={(e) => setBulkForm({ ...bulkForm, appname: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Doctype Name"
                name="doctype_name"
                value={bulkForm.doctype_name}
                onChange={(e) => setBulkForm({ ...bulkForm, doctype_name: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#155a9c',
                  },
                  mb: 2,
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setBulkForm({ ...bulkForm, file: e.target.files[0] })}
                />
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={bulkLoading}
                  sx={{ width: '100%' }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>


    </>
  );
};

export default InsertField;
