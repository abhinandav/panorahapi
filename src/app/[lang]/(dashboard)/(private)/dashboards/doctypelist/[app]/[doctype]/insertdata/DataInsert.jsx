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
import BackButton from '../../../BackButton';

const InsertField = ({ app, doctype }) => {
  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken = localStorage.getItem('authToken');

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [bulkForm, setBulkForm] = useState({
    appname: app,
    doctype_name: doctype,
    file: null,
  });

  const [bulkLoading, setBulkLoading] = useState(false);

  const [payloadEntries, setPayloadEntries] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);

  const handlePayloadChange = (index, field, value) => {
    const updatedPayloadEntries = [...payloadEntries];
    updatedPayloadEntries[index][field] = value;
    setPayloadEntries(updatedPayloadEntries);
  };

  const addPayloadEntry = () => {
    setPayloadEntries([...payloadEntries, { key: '', value: '' }]);
  };

  const removePayloadEntry = (index) => {
    setPayloadEntries(payloadEntries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = payloadEntries.reduce((acc, entry) => {
        if (entry.key) acc[entry.key] = entry.value;
        return acc;
      }, {});

      const response = await axios.post(
        `${server}/doctype/${app}/${doctype}/insert`,
        { payload },
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        }
      );

      if (response.data.status === 'Success') {
        alert('Data Inserted Successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while inserting data.');
    } finally {
      setLoading(false);
    }
  };


  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    

    const file = bulkForm.file
    if (file) {
      const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv';
      if (!isCSV) {
        alert('The selected file is not a CSV file.');
        return;
      }
    }

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

      console.log(response);
      
  
      if (response.status === 201) {
        setResponseData(response.data);
        alert("Bulk insertion Successfull")
      } else {
        setResponseData({ error: `Unexpected response status: ${response.status}` });
        alert("Unexpected response")
      }
    } catch (error) {
      console.error('Error during bulk insert:', error.response?.data || error.message);
      setResponseData({ error: error.response?.data || error.message });
      alert("Error during bulk insert")
    } finally {
      setBulkLoading(false);
      setBulkModalOpen(false);
    }
  };

  return (
    <>
    <BackButton route={`/dashboards/doctypelist/${app}/${doctype}`}/>
    <form onSubmit={handleSubmit} style={{marginTop:40}}>
      <Grid container spacing={2}>
        {payloadEntries.map((entry, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={5} style={{marginTop:10}}>
              <TextField
                fullWidth
                label="Key"
                value={entry.key}
                onChange={(e) => handlePayloadChange(index, 'key', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={5} style={{marginTop:10}}>
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
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addPayloadEntry}>
            Add Entry
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginLeft: '8px' }}
          >
            {loading ? 'Submitting...' : 'Submit'}
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

          {bulkLoading ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={40} />
              <Typography sx={{ mt: 2 }}>Processing...</Typography>
            </Box>
          ) : (
            <form onSubmit={handleBulkSubmit}>
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
