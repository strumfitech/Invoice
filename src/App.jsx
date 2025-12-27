import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './components/Landing.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CompanyConfig from './components/CompanyConfig.jsx';
import ClientConfig from './components/ClientConfig.jsx';
import Analytics from './components/Analytics.jsx';
import Reminders from './components/Reminders.jsx';
import NewInvoicePage from './pages/NewInvoicePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import InvoicePreview from './components/InvoicePreview.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<ProtectedRoute><CompanyConfig /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientConfig /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/new" element={<ProtectedRoute><NewInvoicePage /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/invoice/:id/preview" element={<ProtectedRoute><InvoicePreview /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
