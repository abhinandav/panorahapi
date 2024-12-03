'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import FetchData from '@/app/[lang]/(dashboard)/(private)/dashboards/fetchdata/FetchData'

const FetchDatas = () => {
  const [response, setResponse] = useState({
    body: null,
    headers: null,
    cookies: null,
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12}>
          <FetchData setResponse={setResponse} />
      </Grid>
    </Grid>
  )
}

export default FetchDatas
