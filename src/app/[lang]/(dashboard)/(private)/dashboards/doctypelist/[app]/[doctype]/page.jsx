'use client';

import React from 'react';
import EditDoctype from './EditDoctype'; 
export default function EditDoctypePage({ params }) {
  const { app, doctype } = params;

  if (!app || !doctype) {
    return <p>Error: Missing required parameters.</p>;
  }

  return <EditDoctype app={app} doctype={doctype} />;
}
