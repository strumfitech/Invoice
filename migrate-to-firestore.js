// Migration script to move localStorage data to Firebase Firestore
// Run this with: node migrate-to-firestore.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://factura-b478b.firebaseio.com'
});

const db = admin.firestore();

// Function to migrate users
async function migrateUsers() {
  console.log('Migrating users...');
  try {
    const fs = require('fs');
    const usersData = fs.readFileSync('localStorage_backup.json', 'utf8');
    const data = JSON.parse(usersData);
    const users = data.users || [];

    for (const user of users) {
      try {
        // Note: In production, you should hash passwords properly
        // This is just for migration demonstration
        await db.collection('users').add({
          email: user.username, // assuming username was email
          password: user.password, // In production, hash this
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Migrated user: ${user.username}`);
      } catch (error) {
        console.error(`Error migrating user ${user.username}:`, error);
      }
    }
  } catch (error) {
    console.log('No users data found, skipping...');
  }
}

// Function to migrate companies
async function migrateCompanies(data) {
  console.log('Migrating companies...');
  const companies = data.companies || [];

  for (const company of companies) {
    try {
      await db.collection('companies').add({
        ...company,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Migrated company: ${company.name}`);
    } catch (error) {
      console.error(`Error migrating company ${company.name}:`, error);
    }
  }
}

// Function to migrate clients
async function migrateClients(data) {
  console.log('Migrating clients...');
  const clients = data.clients || [];

  for (const client of clients) {
    try {
      await db.collection('clients').add({
        ...client,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Migrated client: ${client.name}`);
    } catch (error) {
      console.error(`Error migrating client ${client.name}:`, error);
    }
  }
}

// Function to migrate invoices
async function migrateInvoices(data) {
  console.log('Migrating invoices...');
  const invoices = data.invoices || [];

  for (const invoice of invoices) {
    try {
      await db.collection('invoices').add({
        ...invoice,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Migrated invoice: ${invoice.id}`);
    } catch (error) {
      console.error(`Error migrating invoice ${invoice.id}:`, error);
    }
  }
}

// Function to migrate settings
async function migrateSettings(data) {
  console.log('Migrating settings...');
  const lastInvoiceId = data.lastInvoiceId || '1';

  try {
    await db.collection('settings').doc('global').set({
      lastInvoiceId: parseInt(lastInvoiceId),
      currencyRates: {
        RON: 1,
        EUR: 4.9,
        USD: 4.6
      },
      migratedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Migrated settings');
  } catch (error) {
    console.error('Error migrating settings:', error);
  }
}

// Main migration function
async function migrateAll() {
  try {
    console.log('Starting migration from localStorage to Firestore...');

    // Load data from backup file
    const fs = require('fs');
    const backupData = JSON.parse(fs.readFileSync('localStorage_backup.json', 'utf8'));

    await migrateUsers();
    await migrateCompanies(backupData);
    await migrateClients(backupData);
    await migrateInvoices(backupData);
    await migrateSettings(backupData);

    console.log('Migration completed successfully!');
    console.log('You can now clear localStorage and use the Firebase backend.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the Firebase app
    admin.app().delete();
  }
}

// Run migration
migrateAll();
