/* eslint-disable */

'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import QueryParams from '@/app/[lang]/(dashboard)/(private)/dashboards/deletedoc/QueryParams'


const DeleteDoc = async () => {
  const [response, setResponse] = useState({
    body: null,
    headers: null,
    cookies: null,
  })

  return (
    <Grid container spacing={6}>
    <Grid item xs={12} lg={7}>

      <Grid item xs={12} lg={12} mt={10}>
        <QueryParams setResponse={setResponse}/>
      </Grid>
    </Grid>
    
  </Grid>
  )
}

export default DeleteDoc
