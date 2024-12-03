'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import InsertField from '@/app/[lang]/(dashboard)/(private)/dashboards/insertdata/InsertData'

const FilterData = () => {
  const [response, setResponse] = useState({
    body: null,
    headers: null,
    cookies: null,
  })

  return (
    <Grid container spacing={6}>
      
        <Grid item xs={12} mt={10} lg={12}>
          <InsertField setResponse={setResponse} />
        </Grid>
    </Grid>
  )
}

export default FilterData
