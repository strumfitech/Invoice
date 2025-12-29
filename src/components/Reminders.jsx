import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function Reminders() {
  const [invoices, setInvoices] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    try {
      const invs = await storage.getInvoices(user.uid);
      setInvoices(invs);
      const now = new Date();
      const over = invs.filter(inv => inv.dueDate && new Date(inv.dueDate) < now);
      const up = invs.filter(inv => inv.dueDate && new Date(inv.dueDate) >= now && new Date(inv.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)); // next 7 days
      setOverdue(over);
      setUpcoming(up);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center">{t('common.loading')}</div>;
  }

  const sendReminder = (inv) => {
    // Simulate sending email
    alert(`${t('reminders.send_reminder')} ${inv.recipient.email} ${t('common.invoice')} ${inv.id}`);
  };

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← {t('reminders.back')}
        </button>
      </div>
      <h2>{t('reminders.title')}</h2>

      <h3 className="text-danger mt-4">{t('reminders.overdue')}</h3>
      {overdue.length === 0 ? (
        <p>{t('reminders.no_overdue')}</p>
      ) : (
        <div className="list-group">
          {overdue.map(inv => (
            <div key={inv.id} className="list-group-item list-group-item-danger d-flex justify-content-between align-items-center">
              <div>
                <strong>{t('common.invoice')} {inv.id}</strong> - {t('common.date')}: {new Date(inv.dueDate).toLocaleDateString()} - {t('common.total')}: {inv.total}
              </div>
              <button className="btn btn-warning btn-sm" onClick={() => sendReminder(inv)}>{t('reminders.send_reminder')}</button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-warning mt-4">{t('reminders.upcoming')}</h3>
      {upcoming.length === 0 ? (
        <p>{t('reminders.no_upcoming')}</p>
      ) : (
        <div className="list-group">
          {upcoming.map(inv => (
            <div key={inv.id} className="list-group-item list-group-item-warning d-flex justify-content-between align-items-center">
              <div>
                <strong>{t('common.invoice')} {inv.id}</strong> - {t('common.date')}: {new Date(inv.dueDate).toLocaleDateString()} - {t('common.total')}: {inv.total}
              </div>
              <button className="btn btn-info btn-sm" onClick={() => sendReminder(inv)}>{t('reminders.send_notification')}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
