// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    
    try {
      // Store data in Firestore
      await addDoc(collection(db, "disposalRequests"), {
        name: name,
        address: address,
        contact: contact,
        email: email
      });
      alert("Form submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  });
});
