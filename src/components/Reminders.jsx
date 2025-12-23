import React, { useState, useEffect } from 'react';
import storage from '../services/storage.js';

export default function Reminders() {
  const [invoices, setInvoices] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const invs = storage.getInvoices();
    setInvoices(invs);
    const now = new Date();
    const over = invs.filter(inv => inv.dueDate && new Date(inv.dueDate) < now);
    const up = invs.filter(inv => inv.dueDate && new Date(inv.dueDate) >= now && new Date(inv.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)); // next 7 days
    setOverdue(over);
    setUpcoming(up);
  }, []);

  const sendReminder = (inv) => {
    // Simulate sending email
    alert(`Memento trimis către ${inv.recipient.email} pentru factura ${inv.id}`);
  };

  return (
    <div className="container py-5">
      <h2>Mementouri și Notificări</h2>

      <h3 className="text-danger mt-4">Facturi Scadente</h3>
      {overdue.length === 0 ? (
        <p>Nicio factură scadentă.</p>
      ) : (
        <div className="list-group">
          {overdue.map(inv => (
            <div key={inv.id} className="list-group-item list-group-item-danger d-flex justify-content-between align-items-center">
              <div>
                <strong>Factura {inv.id}</strong> - Scadentă: {new Date(inv.dueDate).toLocaleDateString()} - Total: {inv.total}
              </div>
              <button className="btn btn-warning btn-sm" onClick={() => sendReminder(inv)}>Trimite Memento</button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-warning mt-4">Facturi care scad curând</h3>
      {upcoming.length === 0 ? (
        <p>Nicio factură care să scadă în următoarele 7 zile.</p>
      ) : (
        <div className="list-group">
          {upcoming.map(inv => (
            <div key={inv.id} className="list-group-item list-group-item-warning d-flex justify-content-between align-items-center">
              <div>
                <strong>Factura {inv.id}</strong> - Scadentă: {new Date(inv.dueDate).toLocaleDateString()} - Total: {inv.total}
              </div>
              <button className="btn btn-info btn-sm" onClick={() => sendReminder(inv)}>Trimite Notificare</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
