import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  setDoc
} from 'firebase/firestore';

export default {
  // Invoices
  async getInvoices(userId) {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  },

  async saveInvoice(invoice) {
    try {
      const docRef = await addDoc(collection(db, 'invoices'), invoice);
      return docRef.id;
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  },

  async deleteInvoice(invoiceId) {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  async getNextInvoiceId(userId) {
    try {
      const settingsRef = doc(db, 'settings', userId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        const currentId = settingsDoc.data().lastInvoiceId || 0;
        const nextId = currentId + 1;
        await updateDoc(settingsRef, { lastInvoiceId: nextId });
        return nextId;
      } else {
        // Create settings document
        await setDoc(settingsRef, {
          lastInvoiceId: 1,
          currencyRates: { RON: 1, EUR: 4.9, USD: 4.6 }
        });
        return 1;
      }
    } catch (error) {
      console.error('Error getting next invoice ID:', error);
      return Date.now(); // Fallback
    }
  },

  // Companies
  async getCompanies(userId) {
    try {
      const q = query(collection(db, 'companies'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting companies:', error);
      return [];
    }
  },

  async saveCompany(company) {
    try {
      const docRef = await addDoc(collection(db, 'companies'), company);
      return docRef.id;
    } catch (error) {
      console.error('Error saving company:', error);
      throw error;
    }
  },

  async updateCompany(companyId, company) {
    try {
      await updateDoc(doc(db, 'companies', companyId), company);
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  async deleteCompany(companyId) {
    try {
      await deleteDoc(doc(db, 'companies', companyId));
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },

  // Clients
  async getClients(userId) {
    try {
      const q = query(collection(db, 'clients'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  },

  async saveClient(client) {
    try {
      const docRef = await addDoc(collection(db, 'clients'), client);
      return docRef.id;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  },

  async updateClient(clientId, client) {
    try {
      await updateDoc(doc(db, 'clients', clientId), client);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(clientId) {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};
