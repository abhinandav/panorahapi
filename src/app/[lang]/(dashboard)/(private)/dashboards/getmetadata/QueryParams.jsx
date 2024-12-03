/* eslint-disable */

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

const QueryParams = ({ setResponse }) => {
  const [appName, setAppName] = useState('')
  const [modelName, setModelName] = useState('')
  const [responseData, setResponseData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle input changes
  const handleAppNameChange = (e) => setAppName(e.target.value)
  const handleModelNameChange = (e) => setModelName(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!appName || !modelName) {
      setErrorMessage('Both app name and model name are required.')
      return
    }

    setLoading(true)
    setErrorMessage('') // Reset error message

    try {
      const response = await axios.get(`http://127.0.0.1:8001/getjson/${appName}/${modelName}`)

      // Set the response data in state
      setResponseData(response.data)
      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMessage(error.response?.data?.message || 'Error fetching data from the API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Fetch JSON Data" subheader="Provide app name and model name to fetch metadata" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* App Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="App Name"
                value={appName}
                onChange={handleAppNameChange}
                required
              />
            </Grid>

            {/* Model Name Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctype Name"
                value={modelName}
                onChange={handleModelNameChange}
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
                {loading ? 'Loading...' : 'Fetch Data'}
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

export default QueryParams
