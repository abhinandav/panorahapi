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
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const InsertField = () => {
  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken = localStorage.getItem('authToken');

  const [formData, setFormData] = useState({
    app_name: '', // Added app_name field
    table_name: '',
    payload: {},
  });

  const [payloadEntries, setPayloadEntries] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payload entry changes
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

  // Add a new payload entry
  const addPayloadEntry = () => {
    setPayloadEntries([...payloadEntries, { key: '', value: '' }]);
  };

  // Remove an existing payload entry
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { app_name, table_name, payload } = formData;

    try {
      const response = await axios.post(
        `${server}/doctype/${app_name}/${table_name}/insert`,
        { payload },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* App Name and Table Name Fields */}
          <Grid container spacing={2} alignItems="center" style={{ marginBottom: '24px' }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="App Name"
                name="app_name"
                value={formData.app_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
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

          {/* Form Actions */}
          <Grid item xs={12}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addPayloadEntry} style={{ marginRight: '8px' }}>
              Add Entry
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default InsertField;
