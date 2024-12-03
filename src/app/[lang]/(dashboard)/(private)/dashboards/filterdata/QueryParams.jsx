import React, { useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import { IconButton, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const FilterDataForm = ({ setResponse }) => {
  const [tableName, setTableName] = useState('')
  const [filters, setFilters] = useState([{ field: '', value: null, action: '' }])
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)

  // Handle table name input
  const handleTableNameChange = (e) => setTableName(e.target.value)

  // Handle sort field and order input
  const handleSortFieldChange = (e) => setSortField(e.target.value)
  const handleSortOrderChange = (e) => setSortOrder(e.target.value)

  // Handle limit and offset inputs
  const handleLimitChange = (e) => setLimit(e.target.value)
  const handleOffsetChange = (e) => setOffset(e.target.value)

  // Handle changes in filter inputs
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters]
    newFilters[index][field] = value
    setFilters(newFilters)
  }

  // Add new filter input row
  const addFilter = () => {
    setFilters([...filters, { field: '', value: nul, action: '' }])
  }

  // Remove filter input row
  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index)
    setFilters(newFilters)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      table_name: tableName,
      filters: filters.filter(f => f.field && f.value && f.action), // only include filters with all fields filled
      sort: sortField ? { field: sortField, order: sortOrder } : null,
      limit: limit,
      offset: offset,
    }

    try {
      const response = await axios.post('http://127.0.0.1:8001/data/filter', data)
      setResponse({
        body: response.data,
        headers: response.headers,
        cookies: document.cookie,
      })
      console.log('API Response:', response.data)
    } catch (error) {
      console.error('Error filtering data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dynamic rendering of value field based on action
  const renderValueField = (index, action) => {
    // Handling "in" and "not_in" actions for comma-separated lists
    if (action === 'in' || action === 'not_in') {
      return (
        <TextField
          fullWidth
          label="Values (comma separated)"
          value={filters[index].value}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          style={{ margin: "5px" }}
          required
        />
      )
    }
    // Handling boolean for "is" and "not_is"
    else if (action === 'is' || action === 'not_is') {
      return (
        <Select
          fullWidth
          value={filters[index].value}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          style={{ margin: "5px" }}
          required
        >
          <MenuItem value={null}>Null</MenuItem>
          <MenuItem value={false}>Not Null</MenuItem>
        </Select>
      )
    }
    // For comparison actions, value can be a number
    else if (['<', '<=', '>', '>='].includes(action)) {
      return (
        <TextField
          fullWidth
          label="Numeric Value"
          value={filters[index].value}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          style={{ margin: "5px" }}
          type="number"
          required
        />
      )
    }
    // Default behavior for "equals", "like", etc., as a string
    else {
      return (
        <TextField
          fullWidth
          label="Value"
          value={filters[index].value}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          style={{ margin: "5px" }}
          required
        />
      )
    }
  }

  return (
    <Card>
      <CardHeader title="Filter Data" subheader="Apply filters to fetch data from the table" />
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

            {/* Filters Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Filters</Typography>
              {filters.map((filter, index) => (
                <Grid container spacing={2} key={index}>
                  {/* Field */}
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Field"
                      value={filter.field}
                      onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                      style={{ margin: "5px" }}
                      required
                    />
                  </Grid>

                  {/* Value */}
                  <Grid item xs={3}>
                    {renderValueField(index, filter.action)}
                  </Grid>

                  {/* Action (Dropdown) */}
                  <Grid item xs={3}>
                    <FormControl fullWidth style={{ margin: "5px" }}>
                      <InputLabel>Action</InputLabel>
                      <Select
                        value={filter.action}
                        onChange={(e) => handleFilterChange(index, 'action', e.target.value)}
                        required
                      >
                        <MenuItem value="equals">Equals</MenuItem>
                        <MenuItem value="not_equals">Not Equals</MenuItem>
                        <MenuItem value="like">Like</MenuItem>
                        <MenuItem value="not_like">Not Like</MenuItem>
                        <MenuItem value="in">In</MenuItem>
                        <MenuItem value="not_in">Not In</MenuItem>
                        <MenuItem value="is">Is Null</MenuItem>
                        <MenuItem value="not_is">Is Not Null</MenuItem>
                        <MenuItem value="<">Less Than</MenuItem>
                        <MenuItem value="<=">Less Than or Equal</MenuItem>
                        <MenuItem value=">">Greater Than</MenuItem>
                        <MenuItem value=">=">Greater Than or Equal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Remove Filter Button */}
                  <Grid item xs={3}>
                    <IconButton color="secondary" onClick={() => removeFilter(index)}>
                      X
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              {/* Add Filter Button */}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addFilter}
              >
                Add Filter
              </Button>
            </Grid>

            {/* Sort Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sort Field"
                value={sortField}
                onChange={handleSortFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sort Order (asc/desc)"
                value={sortOrder}
                onChange={handleSortOrderChange}
              />
            </Grid>

            {/* Limit and Offset */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Limit"
                value={limit}
                onChange={handleLimitChange}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Offset"
                value={offset}
                onChange={handleOffsetChange}
                type="number"
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
                {loading ? 'Loading...' : 'Filter Data'}
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

export default FilterDataForm
