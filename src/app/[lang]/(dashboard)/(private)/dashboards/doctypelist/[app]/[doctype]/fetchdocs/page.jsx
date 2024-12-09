/* eslint-disable */

'use client';

import React from 'react';
import FetchDocs from './FetchDocs'; 
export default function DocList({ params }) {
  const { app, doctype } = params;

  if (!app || !doctype) {
    return <p>Error: Missing required parameters.</p>;
  }

  return <FetchDocs app={app} doctype={doctype} />;
}





