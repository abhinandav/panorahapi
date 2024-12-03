/* eslint-disable */

'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import QueryParams from '@/app/[lang]/(dashboard)/(private)/dashboards/fileupload/QueryParams'

const UpdateDoc = () => {
  const [response, setResponse] = useState({
    body: null,
    headers: null,
    cookies: null,
  })

  return (
    <Grid container spacing={6}>
      {/* Left Section: Header Table and Query Params */}
      <Grid item xs={12} lg={7}>
    

        {/* Query Parameters Form */}
        <Grid item xs={12} mt={10}>
          <QueryParams setResponse={setResponse} />
        </Grid>
      </Grid>

     
    </Grid>
  )
}

export default UpdateDoc
