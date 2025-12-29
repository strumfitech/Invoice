import React from 'react';
import InvoiceForm from '../components/InvoiceForm.jsx';
import storage from '../services/storage.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function NewInvoicePage(){
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (invoice) => {
    try {
      // Ensure id and date
      const id = await storage.getNextInvoiceId(user.uid);
      const prepared = { ...invoice, id, date: new Date().toISOString(), userId: user.uid };
      // Normalize line calculations
      const lines = prepared.lines.map(l => {
        const lineValue = l.unitPrice * l.quantity;
        const lineTax = (l.vatRate / 100) * l.unitPrice * l.quantity;
        const lineTotal = lineValue + lineTax;
        return { ...l, lineValue, lineTax, lineTotal };
      });
      const subtotal = lines.reduce((a,b)=> a + b.lineValue, 0);
      const totalTax = lines.reduce((a,b)=> a + b.lineTax, 0);
      const total = lines.reduce((a,b)=> a + b.lineTotal, 0);
      const finalInvoice = { ...prepared, lines, subtotal, totalTax, total, currency: prepared.currency || 'RON' };
      await storage.saveInvoice(finalInvoice);
      navigate(`/invoice/${id}/preview`);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert(t('invoice.save_error'));
    }
  };

  return (
    <div className="container my-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← {t('common.back')}
        </button>
      </div>
      <h2 className="text-center mb-5">{t('invoice.create_title')}</h2>
      <InvoiceForm onSubmit={handleSubmit} />
    </div>
  );
}
