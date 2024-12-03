import React, { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'

const DeleteColumnForm = ({ setResponse }) => {
  const [tableName, setTableName] = useState('')
  const [columnName, setColumnName] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleTableNameChange = (e) => setTableName(e.target.value)
  const handleColumnNameChange = (e) => setColumnName(e.target.value)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      table_name: tableName,
      column_name: columnName,
    }

    try {
      console.log('Sending data:', data)

      // Send the data directly in the request body
      const response = await axios.put('http://127.0.0.1:8001/alter/table/delete', data)

      console.log('API Response:', response.data)

      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
    } catch (error) {
      console.error('Error deleting column:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Delete Column" subheader="Provide details to delete an existing column in the model" />
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Delete Column'}
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

export default DeleteColumnForm
