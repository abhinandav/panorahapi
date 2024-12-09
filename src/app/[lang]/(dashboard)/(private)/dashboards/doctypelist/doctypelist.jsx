/* eslint-disable */

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DoctypeListComponent = ({ searchTerm }) => {
  const [doctypes, setDoctypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const server = useSelector((state) => state.server.selectedServer);
  const bearerToken  = localStorage.getItem('authToken')
  const fetchDoctypes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${server}execute`,
        { fn: 'get_doctypes' },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.result)) {
        setDoctypes(response.data.result);
      } else {
        throw new Error('API response is not in the expected format');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching data');
      setShowError(true);
      setDoctypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctypes();
  }, [server, bearerToken]);

  const handleNavigate = (appName, doctypeName) => {
    router.push(`/dashboards/doctypelist/${appName}/${doctypeName}`);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  // Filter doctypes based on the search term
  const filteredDoctypes = doctypes.filter((doctype) => {
    const name = doctype?.name?.toLowerCase() || ""; 
    const app = doctype?.app?.toLowerCase() || "";   
  
    return (
      name.includes(searchTerm.toLowerCase()) ||
      app.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <Card>
        <CardHeader title="Doctype List" subheader="List of available doctypes" />
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctype</TableCell>
                    <TableCell>App (Module)</TableCell>
                    <TableCell>Created Time</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDoctypes.length > 0 ? (
                    filteredDoctypes.map((doctype) => (
                      <TableRow key={doctype.id}>
                        <TableCell>{doctype.name}</TableCell>
                        <TableCell>{doctype.app}</TableCell>
                        <TableCell>{doctype.created_at || 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleNavigate(doctype.app, doctype.name)}
                            aria-label="navigate"
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No doctypes found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DoctypeListComponent;
