// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA-7nlM2TFCBfs--V2lRr2CXsrYgIyNRYs',
  authDomain: 'nuocsachhocduong-977b6.firebaseapp.com',
  projectId: 'nuocsachhocduong-977b6',
  storageBucket: 'nuocsachhocduong-977b6.appspot.com',
  messagingSenderId: '19688520247',
  appId: '1:19688520247:web:74438eb6d8e17c7b5d9db2',
  measurementId: 'G-B1RN8ZXYGM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

export { app, messaging };
