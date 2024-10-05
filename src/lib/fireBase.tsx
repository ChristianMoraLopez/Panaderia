// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyChd3mW3LDyHMMe1RJEeVPPYbqfjh2gUng",
  authDomain: "bakery-c5e31.firebaseapp.com",
  projectId: "bakery-c5e31",
  storageBucket: "bakery-c5e31.appspot.com",
  messagingSenderId: "755087002501",
  appId: "YOUR_APP_ID" // Cambia esto por tu appId, si lo tienes
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
