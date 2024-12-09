/* eslint-disable */

'use client';

import React from 'react';
import DataInsert from './DataInsert'; 
export default function InsertData({ params }) {
  const { app, doctype } = params;

  if (!app || !doctype) {
    return <p>Error: Missing required parameters.</p>;
  }

  return <DataInsert app={app} doctype={doctype} />;
}
