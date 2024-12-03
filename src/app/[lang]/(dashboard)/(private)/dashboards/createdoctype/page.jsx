// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import ResponseDisplay from '@/views/dashboards/createdoctype/ResponseDisplay'
import HeaderTable from '@/views/dashboards/createdoctype/HeaderTable'
import QueryParams from '@/views/dashboards/createdoctype/QueryParams'


const DashboardCreate = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={7}>
        <Grid item xs={12} lg={12}>
          <HeaderTable />
        </Grid>

        <Grid item xs={12} lg={12} mt={10}>
          <QueryParams />
        </Grid>
      </Grid>
      
      <Grid item xs={12} md={6} lg={5}>
        <ResponseDisplay />
      </Grid>
    </Grid>
  )
}

export default DashboardCreate
