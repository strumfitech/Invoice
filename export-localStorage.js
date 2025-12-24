// Run this in your browser console while the app is running
// It will download a JSON file with all your localStorage data

function exportLocalStorage() {
  const data = {
    users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [],
    companies: localStorage.getItem('companies') ? JSON.parse(localStorage.getItem('companies')) : [],
    clients: localStorage.getItem('clients') ? JSON.parse(localStorage.getItem('clients')) : [],
    invoices: localStorage.getItem('invoices') ? JSON.parse(localStorage.getItem('invoices')) : [],
    lastInvoiceId: localStorage.getItem('lastInvoiceId') || '1'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'localStorage_backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('localStorage data exported to localStorage_backup.json');
}

// Run the export
exportLocalStorage();
