/* eslint-disable */

'use client';

import { useEffect, useState } from 'react';
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

const FetchData = ({app,doctype}) => {
  const [tableName, setTableName] = useState('');
  const [data, setData] = useState([]);
  const [conditionEntries, setConditionEntries] = useState([{ key: '', value: '' }]);
  const [conditionDict, setConditionDict] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken  = localStorage.getItem('authToken')



  const handleCloseError = () => setShowError(false);

  const fetchTabledata = async (e) => {
    try {
        console.log('working');
        
      const response = await axios.post(
        `${server}doctype/fetch/${doctype}`,
        { condition_dict: conditionDict },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
        }
      );

      if (response.data.status === 'Success') {
        const fetchedData = response.data.data[0]?.fetched_data || [];
        setData(fetchedData);
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
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Card>
        
        {data.length > 0 ? (
          <CardContent>
            <DataTable app={app} doctype={doctype} data={data} setData={setData} columns={columns} tableName={tableName}/>
          </CardContent>
        ):(
            <CardHeader title="Empty Table" subheader="Nothing here to show, Insert some dat first" />
        )}
      </Card>
    </>
  );
};

export default FetchData;
