import React, { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const AddColumnForm = ({ setResponse }) => {
  const [tableName, setTableName] = useState('')
  const [columnName, setColumnName] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleTableNameChange = (e) => setTableName(e.target.value)
  const handleColumnNameChange = (e) => setColumnName(e.target.value)
  const handleFieldTypeChange = (e) => setFieldType(e.target.value)
  const handleLabelChange = (e) => setLabel(e.target.value)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      table_name: tableName,
      column_name: columnName,
      field_type: fieldType,
      label: label,
    }

    try {
      const response = await axios.put('http://127.0.0.1:8001/alter/table/add', data)
      console.log(response.data);
      
      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error adding column:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Add Column" subheader="Provide details to add a new column to the model" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Table Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Table Name"
                value={tableName}
                onChange={handleTableNameChange}
                required
              />
            </Grid>

            {/* Column Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Column Name"
                value={columnName}
                onChange={handleColumnNameChange}
                required
              />
            </Grid>

            {/* Field Type Field (Assuming it's a select or similar input) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Type"
                value={fieldType}
                onChange={handleFieldTypeChange}
                required
              />
            </Grid>

            {/* Label Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                value={label}
                onChange={handleLabelChange}
                
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Add Column'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Loading Indicator */}
        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

      </CardContent>
    </Card>
  )
}

export default AddColumnForm
