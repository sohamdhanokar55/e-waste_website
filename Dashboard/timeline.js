import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, setDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
    authDomain: 'e-waste-86617.firebaseapp.com',
    projectId: 'e-waste-86617',
    storageBucket: 'e-waste-86617.firebasestorage.app',
    messagingSenderId: '558005114520',
    appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
    measurementId: 'G-EW6GZCDY30',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ensure the form is hidden on page load and add event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scheduleForm").style.display = "none"; // Hide form on page load

    // ✅ Attach event listeners dynamically
    document.getElementById("scheduleButton").addEventListener("click", openForm);
    ;
});

// Open Form for Scheduling / Editing
function openForm() {
    document.getElementById("scheduleForm").style.display = "block"; // Show modal when clicked
    document.getElementById("scheduleButton").style.display = "none"; // Hide "Schedule" button
}

// Save Data to Firebase
function saveTimeline() {
    const assigningAgent = document.getElementById("inputAssigning").value;
    const pickupTransit = document.getElementById("inputTransit").value;
    const pickupComplete = document.getElementById("inputComplete").value;

    // Save to Firestore
    setDoc(doc(db, "pickupTimeline", "latestStatus"), {
        assigningPickupAgent: assigningAgent,
        pickupInTransit: pickupTransit,
        pickupComplete: pickupComplete,
        timestamp: serverTimestamp()
    })
    .then(() => {
        alert("Timeline saved successfully!"); // Alert message after saving

        // Hide form after saving
        document.getElementById("scheduleForm").style.display = "none";

        // Change button text to "Edit Timeline"
        let scheduleBtn = document.getElementById("scheduleButton");
        scheduleBtn.innerText = "Edit Timeline";
        scheduleBtn.style.display = "block"; // Show button again
    })
    .catch((error) => {
        console.error("Error saving data: ", error);
    });
}
