'use client'

import { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const QueryParams = ({ setResponse }) => {
  const [tableName, setTableName] = useState('')
  const [payloadEntries, setPayloadEntries] = useState([
    { key: '', value: '' }, // Default payload entry
  ])

  // Handle table_name input
  const handleTableNameChange = (e) => {
    setTableName(e.target.value)
  }

  // Handle payload key-value updates
  const handlePayloadChange = (index, field, value) => {
    const updatedEntries = [...payloadEntries]
    updatedEntries[index][field] = value
    setPayloadEntries(updatedEntries)
  }

  // Add new payload key-value pair
  const addPayloadEntry = () => {
    setPayloadEntries([...payloadEntries, { key: '', value: '' }])
  }

  // Remove a payload key-value pair
  const removePayloadEntry = (index) => {
    setPayloadEntries(payloadEntries.filter((_, i) => i !== index))
  }

  // Convert value into a list format
  const parseValueToList = (value) => {
    // Split by commas and trim each value, ensuring a list format
    return value.split(',').map((item) => item.trim())
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tableName) {
      alert('Table name is required!')
      return
    }

    // Convert payloadEntries to a payload object, treating all values as lists
    const payload = {}
    payloadEntries.forEach((entry) => {
      if (entry.key) {
        payload[entry.key] = parseValueToList(entry.value)
      }
    })

    try {
      const response = await axios.post(
        'http://127.0.0.1:8001/doctype/delete',
        { table_name: tableName, payload },
        { headers: { 'Content-Type': 'application/json' } }
      )
      setResponse({
        body: response.data,
        headers: null,
        cookies: null,
      })
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error:', error)
      setResponse({
        body: error.response?.data || error.message,
        headers: null,
        cookies: null,
      })
    }
  }

  return (
    <Card>
      <CardHeader title="Delete Document" subheader="Provide table name and payload for deletion" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Table Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Table Name"
                value={tableName}
                onChange={handleTableNameChange}
                required
              />
            </Grid>

            {/* Payload Section */}
            <Grid item xs={12}>
              <h3>Payload (Values as Lists)</h3>
              {payloadEntries.map((entry, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Key"
                      value={entry.key}
                      onChange={(e) => handlePayloadChange(index, 'key', e.target.value)}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Value (comma-separated)"
                      value={entry.value}
                      onChange={(e) => handlePayloadChange(index, 'value', e.target.value)}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removePayloadEntry(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addPayloadEntry}
                style={{ marginTop: '16px' }}
              >
                Add Payload Entry
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px', marginLeft: '10px' }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default QueryParams
