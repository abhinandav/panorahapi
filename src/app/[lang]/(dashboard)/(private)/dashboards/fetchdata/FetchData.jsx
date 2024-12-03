/* eslint-disable */

'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import DataTable from './DataTable';

const FetchData = () => {
  const [tableName, setTableName] = useState('');
  const [data, setData] = useState([]);
  const [conditionEntries, setConditionEntries] = useState([{ key: '', value: '' }]);
  const [conditionDict, setConditionDict] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const server = useSelector((state) => state.server.selectedServer);
  const { bearerToken } = useSelector((state) => state.auth);

  const handleTableNameChange = (e) => setTableName(e.target.value);

  const handleConditionChange = (index, field, value) => {
    const updatedConditionEntries = [...conditionEntries];
    updatedConditionEntries[index][field] = value;
    setConditionEntries(updatedConditionEntries);

    const updatedConditionDict = {};
    updatedConditionEntries.forEach((entry) => {
      if (entry.key) {
        updatedConditionDict[entry.key] = entry.value;
      }
    });
    setConditionDict(updatedConditionDict);
  };

  const addConditionEntry = () => setConditionEntries([...conditionEntries, { key: '', value: '' }]);

  const removeConditionEntry = (index) => {
    const updatedConditionEntries = conditionEntries.filter((_, i) => i !== index);
    setConditionEntries(updatedConditionEntries);

    const updatedConditionDict = {};
    updatedConditionEntries.forEach((entry) => {
      if (entry.key) {
        updatedConditionDict[entry.key] = entry.value;
      }
    });
    setConditionDict(updatedConditionDict);
  };

  const handleCloseError = () => setShowError(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableName) {
      setError('Table name is required!');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${server}doctype/fetch/${tableName}`,
        { condition_dict: conditionDict },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
        }
      );

      if (response.data.status === 'Success') {
        setData(response.data.data);
        if (response.data.data.length > 0) {
          setColumns(Object.keys(response.data.data[0]));
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      setError(error.message || 'Error fetching data');
      setShowError(true);
    } finally {
      setLoading(false);
    }
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

      <Card>
        <CardHeader title="Query Parameters" subheader="Configure condition_dict for API payload" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Table Name"
                  value={tableName}
                  onChange={handleTableNameChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Condition Dictionary</h3>
                {conditionEntries.map((entry, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Key"
                        value={entry.key}
                        onChange={(e) => handleConditionChange(index, 'key', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Value"
                        value={entry.value}
                        onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton color="error" onClick={() => removeConditionEntry(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={addConditionEntry}
                  style={{ marginTop: '16px' }}
                >
                  Add Condition
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>

        {data.length > 0 && (
          <CardContent>
            <DataTable data={data} setData={setData} columns={columns} tableName={tableName}/>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default FetchData;
