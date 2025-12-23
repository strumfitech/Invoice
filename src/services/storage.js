export default {
  getInvoices(){
    const raw = localStorage.getItem('invoices');
    if (!raw){
      const sampleInvoice = {
        id: 1,
        date: new Date().toISOString(),
        currency: 'RON',
        company: { name: 'Companie Exemplu', address: 'Strada Exemplu 1, București', bankAccount: 'RO49 0000 0000 0000 0000 0000', cui: 'CUI12345678', registrationNumber: 'NR1234/2020' },
        recipient: { name: 'Client Exemplu', address: 'Strada Client 1, București', cui: 'CUI87654321' },
        lines: [
          { id: 'l1', type: 'Product', name: 'Produs exemplu A', code: 'P-A', currencyUnit: 'pcs', vatRate: 19, quantity: 2, unitPrice: 25, lineValue: 50, lineTax: 9.5, lineTotal: 59.5 },
          { id: 'l2', type: 'Product', name: 'Serviciu exemplu B', code: 'S-B', currencyUnit: 'pcs', vatRate: 19, quantity: 1, unitPrice: 50, lineValue: 50, lineTax: 9.5, lineTotal: 59.5 }
        ],
        subtotal: 100,
        totalTax: 19,
        total: 119
      };
      localStorage.setItem('invoices', JSON.stringify([sampleInvoice]));
      localStorage.setItem('lastInvoiceId', '1');
      return [sampleInvoice];
    }
    try {
      return raw ? JSON.parse(raw) : [];
    } catch(e){
      localStorage.setItem('invoices', JSON.stringify([]));
      return [];
    }
  },
  saveInvoices(invoices){
    localStorage.setItem('invoices', JSON.stringify(invoices));
  },
  getNextInvoiceId(){
    const last = localStorage.getItem('lastInvoiceId') || '0';
    const next = parseInt(last) + 1;
    localStorage.setItem('lastInvoiceId', next.toString());
    return next;
  },
  getCompany(){
    const raw = localStorage.getItem('company');
    try { return raw ? JSON.parse(raw) : { name:'', address:'', bankAccount:'', cui:'', registrationNumber:'' }; } catch(e){ return { name:'', address:'', bankAccount:'', cui:'', registrationNumber:'' }; }
  },
  setCompany(company){
    localStorage.setItem('company', JSON.stringify(company));
  },
  getCompanies(){
    const raw = localStorage.getItem('companies');
    try { return raw ? JSON.parse(raw) : []; } catch(e){ return []; }
  },
  saveCompanies(companies){
    localStorage.setItem('companies', JSON.stringify(companies));
  },
  getClients(){
    const raw = localStorage.getItem('clients');
    try { return raw ? JSON.parse(raw) : []; } catch(e){ return []; }
  },
  saveClients(clients){
    localStorage.setItem('clients', JSON.stringify(clients));
  },
  clearAll(){
    localStorage.removeItem('invoices');
    localStorage.removeItem('company');
    localStorage.removeItem('companies');
    localStorage.removeItem('clients');
  }
};
