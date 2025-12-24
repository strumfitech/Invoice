import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA93RR4vd2CMb091F-DblsPUDYGUCbZ9H0",
  authDomain: "factura-b478b.firebaseapp.com",
  projectId: "factura-b478b",
  storageBucket: "factura-b478b.firebasestorage.app",
  messagingSenderId: "48919465520",
  appId: "1:48919465520:web:387f8059d81374bd3b67f5",
  measurementId: "G-JVYS63P296"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
