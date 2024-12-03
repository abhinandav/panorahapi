'use client'

// Next.js imports
import { useState } from 'react'

// MUI imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const QueryParams = () => {
  const [formData, setFormData] = useState({
    app: '',
    doc_type_name: '',
    fields: [
      {
        name: '',
        field_type: 'Data',
        label: '',
        permlevel: 0,
        options: null,
      },
    ],
    is_child_table: false,
    is_tree: false,
    is_single: false,
    is_submittable: false,
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle field changes
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target
    const updatedFields = [...formData.fields]
    updatedFields[index] = { ...updatedFields[index], [name]: value }
    setFormData((prev) => ({
      ...prev,
      fields: updatedFields,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Submitted:', formData)
  }

  return (
    <Card>
      <CardHeader title='Query Parameters' subheader='Configure your query parameters' />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* App Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='App Name'
                name='app'
                value={formData.app}
                onChange={handleChange}
              />
            </Grid>

            {/* Doc Type Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Doc Type Name'
                name='doc_type_name'
                value={formData.doc_type_name}
                onChange={handleChange}
              />
            </Grid>

            {/* Field Configuration */}
            <Grid item xs={12}>
              <h3>Field Configuration</h3>
              {formData.fields.map((field, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label='Field Name'
                      name='name'
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label='Field Type'
                      name='field_type'
                      value={field.field_type}
                      onChange={(e) => handleFieldChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label='Field Label'
                      name='label'
                      value={field.label}
                      onChange={(e) => handleFieldChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label='Permission Level'
                      type='number'
                      name='permlevel'
                      value={field.permlevel}
                      onChange={(e) => handleFieldChange(index, e)}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/* Checkbox Options */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_child_table'
                    checked={formData.is_child_table}
                    onChange={handleCheckboxChange}
                  />
                }
                label='Is Child Table'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_tree'
                    checked={formData.is_tree}
                    onChange={handleCheckboxChange}
                  />
                }
                label='Is Tree'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_single'
                    checked={formData.is_single}
                    onChange={handleCheckboxChange}
                  />
                }
                label='Is Single'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_submittable'
                    checked={formData.is_submittable}
                    onChange={handleCheckboxChange}
                  />
                }
                label='Is Submittable'
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
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
