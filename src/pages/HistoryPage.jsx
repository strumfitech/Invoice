import React from 'react';
import InvoiceList from '../components/InvoiceList.jsx';

export default function HistoryPage(){
  return (
    <div className="container my-4">
      <h2>Istoric facturi</h2>
      <InvoiceList />
    </div>
  );
}
