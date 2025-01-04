/* eslint-disable */

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Box,
  Grid,
  TextField,
} from '@mui/material';
import DataTable from './DataTable';
import BackButton from '../../../BackButton';

const FetchData = ({app,doctype}) => {
  const [tableName, setTableName] = useState('');
  const [data, setData] = useState([]);
  const [conditionEntries, setConditionEntries] = useState([{ key: '', value: '' }]);
  const [conditionDict, setConditionDict] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const server  = localStorage.getItem('server')
  const bearerToken  = localStorage.getItem('authToken')



  const handleCloseError = () => setShowError(false);

  const fetchTabledata = async (e) => {
    try {
        console.log('working');
        
      const response = await axios.post(
        `${server}doctype/${app}/${doctype}/fetch`,
        { condition_dict: conditionDict },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
        }
      );
      console.log(response.data.data?.doc_data || []);
      if (response.data.status === 'Success') {
        const fetchedData = response.data.data;
        setData(fetchedData);
        console.log(fetchedData);
        

        if (fetchedData.length > 0) {
          setColumns(Object.keys(fetchedData[0])); 
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
  useEffect(()=>{
    fetchTabledata()
  },[server])


return (
    <>
      <BackButton route={`/dashboards/doctypelist/${app}/${doctype}`} />

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ padding: '16px' }}>
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '24px' }}>
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

        <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Card>
          {data.length > 0 ? (
            <CardContent>
              <DataTable app={app} doctype={doctype} data={data} setData={setData} columns={columns} tableName={tableName} />
            </CardContent>
          ) : (
            <CardHeader title="Empty Table" subheader="Nothing here to show, Insert some data first" />
          )}
        </Card>
      </Box>
    </>
  );
};

export default FetchData;
