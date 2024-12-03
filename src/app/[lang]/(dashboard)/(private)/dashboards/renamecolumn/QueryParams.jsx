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

const RenameColumnForm = ({ setResponse }) => {
  const [tableName, setTableName] = useState('')
  const [currentColumn, setCurrentColumn] = useState('')
  const [newColumn, setNewColumn] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleTableNameChange = (e) => setTableName(e.target.value)
  const handleCurrentColumnChange = (e) => setCurrentColumn(e.target.value)
  const handleNewColumnChange = (e) => setNewColumn(e.target.value)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      table_name: tableName,
      current_column: currentColumn,
      new_column: newColumn,
    }

    try {
      const response = await axios.put('http://127.0.0.1:8001/alter/table/rename', data)
      console.log(response.data)
      
      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error renaming column:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Rename Column" subheader="Provide details to rename an existing column in the model" />
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

            {/* Current Column Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Column Name"
                value={currentColumn}
                onChange={handleCurrentColumnChange}
                required
              />
            </Grid>

            {/* New Column Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Column Name"
                value={newColumn}
                onChange={handleNewColumnChange}
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
                {loading ? 'Loading...' : 'Rename Column'}
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

export default RenameColumnForm
