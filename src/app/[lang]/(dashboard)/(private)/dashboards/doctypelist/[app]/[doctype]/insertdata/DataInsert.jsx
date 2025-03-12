/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
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
import BackButton from '../../../BackButton';

const InsertField = ({ app, doctype }) => {
  const server  = localStorage.getItem('server')
  const bearerToken = localStorage.getItem('authToken');

  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState([]); // Holds the list of columns and their values
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch the metadata (columns of the table)
  const fetchMetadata = async () => {
    try {
      const response = await axios.get(`${server}doctype/getjson?doctype=${doctype}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
  
      if (response.data && Array.isArray(response.data.data.fields)) {
        const excludedFields = ['name', 'created_by', 'updated_by', 'created_at', 'updated_at', 'id',"status"];
  
        // Filter out unnecessary fields and map the remaining fields
        const fields = response.data.data.fields
          .filter((field) => !excludedFields.includes(field.fieldname)) // Exclude unwanted fields
          .map((field) => ({
            key: field.fieldname, // Column name
            value: '',       // Default empty value
          }));
  
        setFormFields(fields); // Store only necessary fields
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };
  
  useEffect(() => {
    fetchMetadata();
  }, [server, app, doctype]);

  // Handle value changes for input fields
  const handleInputChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const excludedFields = ['name', 'created_by', 'updated_by', 'created_at', 'updated_at', 'id'];
      const payload = formFields.reduce((acc, field) => {
        if (field.value !== '') acc[field.key] = field.value; // Include only non-empty fields
        return acc;
      }, {});

      const response = await axios.post(
        `${server}doctype/insert?doctype=${doctype}`,
        { payload },
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        }
      );

      console.log(response.data);
      
      if (response.data.status === 'Success') {
        alert('Data inserted successfully!');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Error inserting data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkLoading(true);

    const formData = new FormData();
    formData.append('data', file);

    try {
      const response = await axios.post(
        `${server}/doctype/bulk_insert?app=${app}&doctype_name=${doctype}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        alert('Bulk insertion successful!');
      } else {
        alert('Bulk insertion failed!');
      }
    } catch (error) {
      console.error('Error during bulk insert:', error);
    } finally {
      setBulkLoading(false);
      setBulkModalOpen(false);
    }
  };

  return (
    <>
      <BackButton route={`/dashboards/doctypelist/${app}/${doctype}`} />

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '24px',marginTop: '24px' }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="App Name"
              name="app_name"
              value={app}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Table Name"
              name="table_name"
              value={doctype}
              InputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>
        </Grid>

      <form onSubmit={handleSubmit} style={{ marginTop: 40 }}>
        <Grid container spacing={2}>
          {formFields.map((field, index) => (
            <Grid key={field.key} item xs={12} sm={6}>
              <TextField
                fullWidth
                label={field.key} 
                value={field.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ marginTop: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setBulkModalOpen(true)}
            sx={{ marginLeft: 2 }}
          >
            Bulk Insert
          </Button>
        </Box>
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
          width: 400,
        }}
      >
        <Typography variant="h6" mb={2}>
          Bulk Insert
        </Typography>

        {bulkLoading ? (
          // Display loading bar during bulk loading
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body1" mt={2}>
              Uploading and processing file...
            </Typography>
          </Box>
        ) : (
          // File upload form when not loading
          <form onSubmit={handleBulkSubmit}>
            <Button variant="contained" component="label">
              Upload CSV File
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </Button>

            <Box sx={{ marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!file}
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
