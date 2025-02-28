import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA",
    authDomain: "e-waste-86617.firebaseapp.com",
    projectId: "e-waste-86617",
    storageBucket: "e-waste-86617.firebasestorage.app",
    messagingSenderId: "558005114520",
    appId: "1:558005114520:web:a8b5fb2bc1cc22340fa2ed",
    measurementId: "G-EW6GZCDY30"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);  // ✅ Export auth
