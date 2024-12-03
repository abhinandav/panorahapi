'use client'

import React, { useState } from 'react'

// Material-UI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add';

const HeadersTable = () => {
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json' },
  ])

  // Add a new header
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }])
  }

  // Remove a header by index
  const removeHeader = (index) => {
    const updatedHeaders = headers.filter((_, i) => i !== index)
    setHeaders(updatedHeaders)
  }

  // Update a header key or value
  const updateHeader = (index, field, value) => {
    const updatedHeaders = [...headers]
    updatedHeaders[index][field] = value
    setHeaders(updatedHeaders)
  }

  // Handle form submission
  const handleSubmit = () => {
    console.log('Headers Submitted:', headers)
  }

  return (
    <Card>
      <CardHeader title="Headers Configuration" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Key</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {headers.map((header, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={header.key}
                      placeholder="Enter key"
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={header.value}
                      placeholder="Enter value"
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => removeHeader(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          color="primary"
          onClick={addHeader}
          style={{ marginTop: '16px' }}
        >
          Add Header
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '16px', marginLeft: '8px' }}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  )
}

export default HeadersTable
