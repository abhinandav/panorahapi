/* eslint-disable */

'use client'

import { useState, useEffect } from 'react'
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
  const [docname, setDocname] = useState('')
  const [doctype, setDoctype] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setProgress(0)
    setMessage('')
  }

  // Handle form field changes
  const handleDocnameChange = (e) => setDocname(e.target.value)
  const handleDoctypeChange = (e) => setDoctype(e.target.value)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!docname || !doctype || !file) {
      setMessage("All fields are required!")
      return
    }

    const formData = new FormData()
    formData.append('docname', docname)
    formData.append('doctype', doctype)
    formData.append('data', file)

    const apiUrl = `http://127.0.0.1:8001/upload/file_uploads?docname=${docname}&doctype=${doctype}`

    try {
      setUploading(true)
      setMessage('Uploading file...')

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(progressPercent)
          }
        }
      })

      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
      console.log('API Response:', response.data)

      const { file_name } = response.data
      if (file_name) {
        trackProgress(file_name)
      } else {
        throw new Error('File name not returned by the server.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setMessage(`Error: ${error.message}`)
      setUploading(false)
    }
  }

  // WebSocket for progress tracking
  const trackProgress = (fileName) => {
    const socket = new WebSocket(`ws://127.0.0.1:8001/upload/file_uploads/progress?file_name=${fileName}`)

    socket.onopen = () => {
      setMessage('Tracking progress...')
      console.log('WebSocket connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.event === 'progress') {
        setProgress(parseInt(data.data, 10))
        console.log('Progress:', data.data)
      } else if (data.event === 'completed') {
        setProgress(100)
        setMessage('File upload completed successfully!')
        console.log('Upload completed')
        setUploading(false)
        socket.close()
      } else if (data.event === 'error') {
        setMessage(`Error: ${data.data}`)
        setUploading(false)
        socket.close()
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setMessage('Error tracking upload progress')
      setUploading(false)
      socket.close()
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }
  }

  return (
    <Card>
      <CardHeader title="File Upload" subheader="Provide docname, doctype, and upload a file" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Docname Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Docname"
                value={docname}
                onChange={handleDocnameChange}
                required
              />
            </Grid>

            {/* Doctype Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctype"
                value={doctype}
                onChange={handleDoctypeChange}
                required
              />
            </Grid>

            {/* File Input */}
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload File
              </Typography>
              <input type="file" onChange={handleFileChange} required />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Submit'}
              </Button>
            </Grid>

            {/* Progress Bar */}
            {uploading && (
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" align="center">{`${progress}%`}</Typography>
              </Grid>
            )}

            {/* Status Message */}
            <Grid item xs={12}>
              <Typography variant="body1">{message}</Typography>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default QueryParams
