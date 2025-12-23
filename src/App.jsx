import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import NewInvoicePage from './pages/NewInvoicePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import InvoicePreview from './components/InvoicePreview.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewInvoicePage />} />
        <Route path="/invoices" element={<HistoryPage />} />
        <Route path="/invoice/:id/preview" element={<InvoicePreview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
