import React from 'react';
import { useTranslation } from 'react-i18next';
import InvoiceList from '../components/InvoiceList.jsx';

export default function HistoryPage(){
  const { t } = useTranslation();

  return (
    <div className="container my-4">
      <h2>{t('invoice_list.title')}</h2>
      <InvoiceList />
    </div>
  );
}
