import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import storage from '../services/storage.js';
import { getExchangeRates, convertAmount } from '../services/currency.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoicePreview(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [rates, setRates] = useState({});
  const invoices = storage.getInvoices();
  const inv = invoices.find(v => String(v.id) === String(id));

  useEffect(() => {
    getExchangeRates().then(setRates);
  }, []);

  if(!inv){
    return (
      <div className="container py-5">
        <h2>Factura negăsită</h2>
        <p>Factura cu ID-ul {id} nu a fost găsită în istoric.</p>
      </div>
    );
  }

  const company = inv.company || {};
  const recipient = inv.recipient || {};
  const lines = inv.lines || [];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = () => {
    const element = document.getElementById('invoice-content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Factura_${inv.id}.pdf`);
    });
  };

  const handlePreviewInvoice = () => {
    const element = document.getElementById('invoice-content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>← Înapoi</button>
          <h2>Factura #{inv.id}</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handlePrint}>Print</button>
          <button className="btn btn-primary" onClick={handleSaveAsPDF}>Save as PDF</button>
          <button className="btn btn-outline-primary" onClick={handlePreviewInvoice}>Preview Invoice</button>
        </div>
      </div>
      <div id="invoice-content" style={{ backgroundColor: 'white', padding: '25mm', minHeight: '247mm', boxSizing: 'border-box' }}>
        <div className="d-flex justify-content-between mb-4">
          <div style={{ flex: 1 }}>
            <h5>Companie:</h5>
            <div>{company.name || ''}</div>
            <div>{company.address || ''}</div>
            <div>Cont: {company.bankAccount || ''}</div>
            <div>CUI: {company.cui || ''}</div>
            <div>Nr Inregistrare: {company.registrationNumber || ''}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>Factura</h1>
            <h3>Nr. {inv.id}</h3>
            <div>Data: {new Date(inv.date).toLocaleDateString()}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h5>Destinatar:</h5>
            <div>{recipient.name || ''}</div>
            <div>{recipient.address || ''}</div>
            <div>CUI: {recipient.cui || ''}</div>
          </div>
        </div>
        <table className="table table-bordered" style={{ marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Tip</th>
              <th style={{ padding: '10px' }}>Denumire articol</th>
              <th style={{ padding: '10px' }}>Cod</th>
              <th style={{ padding: '10px' }}>Unitati</th>
              <th style={{ padding: '10px' }}>TVA %</th>
              <th style={{ padding: '10px' }}>Cantitate</th>
              <th style={{ padding: '10px' }}>Pret Unitar</th>
              <th style={{ padding: '10px' }}>Valoare</th>
              <th style={{ padding: '10px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((ln) => (
              <tr key={ln.id}>
                <td style={{ padding: '10px' }}>{ln.type}</td>
                <td style={{ padding: '10px' }}>{ln.name}</td>
                <td style={{ padding: '10px' }}>{ln.code}</td>
                <td style={{ padding: '10px' }}>{ln.currencyUnit}</td>
                <td style={{ padding: '10px' }}>{ln.vatRate}</td>
                <td style={{ padding: '10px' }}>{ln.quantity}</td>
                <td style={{ padding: '10px' }}>{ln.unitPrice}</td>
                <td style={{ padding: '10px' }}>{ln.lineValue}</td>
                <td style={{ padding: '10px' }}>{ln.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <div><strong>Subtotal:</strong> {inv.subtotal} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.subtotal, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
          <div><strong>TVA:</strong> {inv.totalTax} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.totalTax, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
          <div><strong>Total:</strong> {inv.total} {inv.currency} {inv.currency !== 'RON' && rates.RON ? `(${convertAmount(inv.total, inv.currency, 'RON', rates).toFixed(2)} RON)` : ''}</div>
        </div>
      </div>
    </div>
  );
}
