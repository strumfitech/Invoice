# Migration to Firebase Firestore

This guide will help you migrate your localStorage data to Firebase Firestore.

## Prerequisites

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account-key.json` in this directory

## Setup

1. Install dependencies:
```bash
npm install --package-lock-only package-migration.json
```

2. Place your service account key file in the root directory as `firebase-service-account-key.json`

3. Update the `migrate-to-firestore.js` file:
   - Replace `'https://your-project-id.firebaseio.com'` with your actual Firebase project URL

## Running the Migration

```bash
npm run migrate --package-lock-only package-migration.json
```

## What Gets Migrated

- Users (from localStorage 'users')
- Companies (from localStorage 'companies')
- Clients (from localStorage 'clients')
- Invoices (from localStorage 'invoices')
- Settings (lastInvoiceId, currency rates)

## After Migration

1. Update your frontend code to use Firebase instead of localStorage
2. Test the application thoroughly
3. Clear localStorage if everything works

## Security Note

This migration script includes passwords as-is. In production, implement proper password hashing with bcrypt or similar before storing in Firestore.

## Troubleshooting

- Make sure your Firebase project has Firestore enabled
- Check that the service account has proper permissions
- Verify your localStorage data is valid JSON
