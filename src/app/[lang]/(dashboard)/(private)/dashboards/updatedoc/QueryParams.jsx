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
  const [payloadEntries, setPayloadEntries] = useState([{ key: '', value: '' }])
  const [conditionEntries, setConditionEntries] = useState([{ key: '', value: '' }])

  // Handle table_name input
  const handleTableNameChange = (e) => {
    setTableName(e.target.value)
  }

  // Handle key-value updates for payload and condition_dict
  const handleEntryChange = (index, field, value, type) => {
    const updatedEntries = type === 'payload' ? [...payloadEntries] : [...conditionEntries]
    updatedEntries[index][field] = value

    if (type === 'payload') setPayloadEntries(updatedEntries)
    else setConditionEntries(updatedEntries)
  }

  // Add new key-value pair
  const addEntry = (type) => {
    if (type === 'payload') setPayloadEntries([...payloadEntries, { key: '', value: '' }])
    else setConditionEntries([...conditionEntries, { key: '', value: '' }])
  }

  // Remove a key-value pair
  const removeEntry = (index, type) => {
    if (type === 'payload') {
      setPayloadEntries(payloadEntries.filter((_, i) => i !== index))
    } else {
      setConditionEntries(conditionEntries.filter((_, i) => i !== index))
    }
  }

  // Convert value into the appropriate type
  const parseValue = (value) => {
    try {
      // Try to parse as JSON for lists, numbers, objects, etc.
      return JSON.parse(value)
    } catch {
      // Default to string if parsing fails
      return value
    }
  }

  // Convert entries into key-value object with type-handling
  const convertEntriesToObject = (entries) => {
    const obj = {}
    entries.forEach((entry) => {
      if (entry.key) {
        obj[entry.key] = parseValue(entry.value)
      }
    })
    return obj
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tableName) {
      alert('Table name is required!')
      return
    }

    const payload = convertEntriesToObject(payloadEntries)
    const conditionDict = convertEntriesToObject(conditionEntries)

    try {
      const response = await axios.put(
        'http://127.0.0.1:8001/doctype/update',
        {
          table_name: tableName,
          payload,
          condition_dict: conditionDict,
        },
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
      <CardHeader title="Update Document" subheader="Provide table name, payload, and conditions for updating data" />
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
              <h3>Payload</h3>
              {payloadEntries.map((entry, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Key"
                      value={entry.key}
                      onChange={(e) => handleEntryChange(index, 'key', e.target.value, 'payload')}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={entry.value}
                      onChange={(e) => handleEntryChange(index, 'value', e.target.value, 'payload')}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removeEntry(index, 'payload')}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => addEntry('payload')}
                style={{ marginTop: '16px' }}
              >
                Add Payload Entry
              </Button>
            </Grid>

            {/* Condition Section */}
            <Grid item xs={12}>
              <h3>Condition Dictionary</h3>
              {conditionEntries.map((entry, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Key"
                      value={entry.key}
                      onChange={(e) => handleEntryChange(index, 'key', e.target.value, 'condition')}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={entry.value}
                      onChange={(e) => handleEntryChange(index, 'value', e.target.value, 'condition')}
                      style={{ margin: '5px' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removeEntry(index, 'condition')}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => addEntry('condition')}
                style={{ marginTop: '16px' }}
              >
                Add Condition Entry
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
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
