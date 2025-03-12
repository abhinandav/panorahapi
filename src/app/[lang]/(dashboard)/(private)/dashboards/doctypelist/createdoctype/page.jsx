/* eslint-disable */

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
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
  Snackbar,
  Backdrop,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useSelector } from 'react-redux';
import BackButton from '../BackButton';

const CreateDoctype = () => {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [fieldTypes,setFieldType] = useState([])

  
  const server  = localStorage.getItem('server')
  const bearerToken  = localStorage.getItem('authToken')

  const [form, setForm] = useState({
    app: "",
    doc_type_name: "",
    fields: [
      {
        fieldname: "",
        fieldtype: "Data",
        label: "",
        options: "",
        fetch_from: "",
        depends_on: "",
        description: "",
        defaultValue: "",
        mandatory: 0,
        has_image: 0,
        isLoadingProp: 0,
        hidden: 0,
        read_only: 0,
        in_list_view: 0,
        in_filter: 0,
        index: 0,
        bold: 0,
        allow_in_quick_entry: 0,
        in_preview: 0,
        in_global_search: 0,
        ignore_user_permissions: 0,
        unique: 0,
      },
    ],
    image_field: "",
    title_field: "",
    view_layout_type: "List",
    naming_rule: "",
    auto_name: "",
    is_child_table: 0,
    is_tree: 0,
    is_single: 0,
    is_submittable: 0,
    show_print_button: 1,
    show_create: 1,
  });
  


  const fetchApps = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${server}/execute`, { fn: 'get_apps' },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      console.log(response.data.result);
      
      if (response.data && Array.isArray(response.data.result)) {
        setApps(response.data.result);
        console.log("fetching apps");
        
      } else {
        throw new Error('API response is not in the expected format');
      }
    } catch (err) {
      setError(err.message || 'Error fetching apps');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const fetch_datatypes = async () => {
      try {
        const response = await axios.post(`${server}/execute`, { fn: 'display_all_field_types' },
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (response.data && Array.isArray(response.data.result)) {
          setFieldType(response.data.result);
          console.log("fetching datatypes");   
        } else {
          throw new Error('API response is not in the expected format');
        }
      } catch (err) {
        setError(err.message || 'Error fetching apps');
      } finally {
        setLoading(false);
      }
    };
    fetch_datatypes()
  },[])

  useEffect(() => {
    if (!server) {
      setError('No server selected!');
      setShowError(true);
      return;
    }
    fetchApps();
  }, [server]);

  const handleCheckboxChange = (key) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : 0,
    }));
  };

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          fieldname: "",
          fieldtype: "Data",
          label: "",
          fetch_from: "",
          depends_on: "",
          description: "",
          options: "",
          defaultValue: "",
          mandatory: 0,
          has_image: 0,
          isLoadingProp: 0,
          hidden: 0,
          read_only: 0,
          in_list_view: 0,
          in_filter: 0,
          index: 0,
          bold: 0,
          allow_in_quick_entry: 0,
          in_preview: 0,
          in_global_search: 0,
          ignore_user_permissions: 0,
          unique: 0,
        },
      ],
    }));
  };
  
  const handleRemoveRow = (index) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleFieldEdit = (index, key, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index][key] = value;
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleSubmit = async () => {
    console.log(form);
    
    // setLoading(true);
    // try {
    //   const response = await axios.post(`${server}/document`, form,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${bearerToken}`,
    //       },
    //     }
    //   );
    //   console.log(response);
    //   console.log(response.data);
    //   console.log(response.data.status);
      
    //   if (response.data.status === 'success') {
    //     router.push('/dashboards/doctypelist');
    //   } else {
    //     throw new Error('Error submitting form');
    //   }
    // } catch (err) {
    //   setError(err.message || 'Error submitting form');
    //   setShowError(true);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleCloseError = () => {
    setShowError(false);

  };

  return (
    <Box sx={{
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "16px", 
    }}>
      <BackButton route={"/dashboards/doctypelist"} />
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ padding: '16px' }}>


      <Grid container spacing={2} sx={{ marginTop: "16px" }}>
        {/* Grid for Text Fields & Select Inputs */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {Object.entries(form).map(([key, value], index) => (
              key !== "fields" && value !== 0 && value !== 1 && ( 
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ width: "100%" }}>
                    {key === "app" ? (
                      <Select
                        value={form.app || (apps.length > 0 ? apps[0] : "")}
                        onChange={(e) => handleFieldChange("app", e.target.value)}
                        variant="outlined"
                        fullWidth
                        displayEmpty
                        required
                      >
                        <MenuItem value="" disabled>Select or Enter an App</MenuItem>
                        {apps.map((app, i) => (
                          <MenuItem key={i} value={app}>{app}</MenuItem>
                        ))}
                      </Select>
                    ) : key === "view_layout_type" ? ( 
                      <Select
                        value={form.view_layout_type || (form.length > 0 ? form[0] : "")}
                        onChange={(e) => handleFieldChange("view_layout_type", e.target.value)}
                        variant="outlined"
                        fullWidth
                        displayEmpty
                        required
                      >
                        <MenuItem value="List">List</MenuItem>
                        <MenuItem value="Report">Report</MenuItem>
                      </Select>
                    ) : typeof value === "string" ? ( 
                      <TextField
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        label={key.replace(/_/g, " ")}
                        variant="outlined"
                        fullWidth
                      />
                    ) : null}
                  </Box>
                </Grid>
              )
            ))}
          </Grid>
        </Grid>

          {/* Grid for Checkboxes */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {Object.entries(form).map(([key, value], index) => (
                (value === 0 || value === 1) && ( // Only render checkboxes
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={Boolean(value)}
                        onChange={() => handleCheckboxChange(key)}
                      />
                      <Typography>{key.replace(/_/g, " ")}</Typography>
                    </Box>
                  </Grid>
                )
              ))}
            </Grid>
          </Grid>
        </Grid>




        <Typography variant="h6" sx={{ marginTop: '16px' }}>
          Fields
        </Typography>

        
        <TableContainer 
          component={Paper}
          sx={{
            marginTop: "8px",
            maxWidth: "100%", 
            overflowX: "auto", 
          }}
          >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                {Object.keys(form.fields[0] || {}).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.fields.map((field, index) => (
                <TableRow key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                  <TableCell>{index + 1}</TableCell>
                  {Object.entries(field).map(([key, value]) => (
                    <TableCell key={key}>
                      {typeof value === "string" && key !== "fieldtype" ? (
                        <TextField
                          value={value}
                          onChange={(e) => handleFieldEdit(index, key, e.target.value)}
                          size="small"
                          style={{ width: "100px" }}
                        />
                      ) : value === 0 || value === 1 ? (
                        <Checkbox
                          checked={Boolean(value)}
                          onChange={(e) => handleFieldEdit(index, key, e.target.checked ? 1 : 0)}
                        />
                      ) : key === "fieldtype" ? (
                        <Select
                          value={value}
                          onChange={(e) => handleFieldEdit(index, key, e.target.value)}
                          size="small"
                          fullWidth
                        >
                          {fieldTypes.map((type, i) => (
                            <MenuItem key={i} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <TextField
                          value={value}
                          onChange={(e) => handleFieldEdit(index, key, e.target.value)}
                          size="small"
                          style={{ width: "100px" }}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleRemoveRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>



        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button startIcon={<AddIcon />} onClick={handleAddRow} variant="contained">
            Add Row
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateDoctype;
