/* eslint-disable */

'use client'
import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import Doctypelist from '@/app/[lang]/(dashboard)/(private)/dashboards/doctypelist/doctypelist'
import DoctypeHeader from '@/app/[lang]/(dashboard)/(private)/dashboards/doctypelist/topbar'


const DoctypeList = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const handleFilterChange = (value) => {
    setSearchTerm(value); // Update search term
  };


  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12}>
        <DoctypeHeader onFilterChange={handleFilterChange} />
      </Grid> 

      <Grid item xs={12} lg={12}>
        <Doctypelist searchTerm={searchTerm}/>
      </Grid>

    </Grid>
  )
}

export default DoctypeList
