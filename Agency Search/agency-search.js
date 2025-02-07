// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Function to fetch agencies from Firestore
function fetchAgencies() {
    const agencyList = document.getElementById("agencyList");
    agencyList.innerHTML = '';  // Clear any existing list items before adding new ones

    // Fetch all agencies from Firestore
    getDocs(collection(db, "agencyLogin")).then(snapshot => {
        // Log the snapshot docs array
        console.log("Snapshot docs:", snapshot.docs);  // Log all docs to ensure we have access to them
    
        if (snapshot.empty) {
            console.log("No agencies found.");
            agencyList.innerHTML = "<p>No agencies found.</p>";
        } else {
            // Loop through the docs array and log individual documents
            snapshot.docs.forEach(doc => {
                console.log("Document ID:", doc.id);  // Log document ID
                const agency = doc.data();
                console.log("Agency data:", agency);  // Log the agency data
    
                if (agency.firstName && agency.districtName) {
                    const li = document.createElement("li");
                    li.classList.add("agency");
                    li.innerHTML = `<span>${agency.firstName} - ${agency.districtName}</span>`;
                    li.onclick = () => showDetails(agency.firstName, agency.districtName, agency.email, agency.contact);
                    agencyList.appendChild(li);
                } else {
                    console.log("Missing required fields in agency document:", doc.id);
                }
            });
        }
    }).catch(error => {
        console.error("Error fetching agencies: ", error);
    });
    
}

// Function to show agency details
function showDetails(firstName, districtName, email, contact) {
    const detailsDiv = document.getElementById('agencyDetails');
    detailsDiv.innerHTML = `
        <h3>${firstName}</h3>
        <p><strong>District:</strong> ${districtName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <button class="select-btn" onclick="requestDisposal('${firstName}')">Place Disposal Request</button>
    `;
    detailsDiv.style.display = 'block';
}

// Function to handle disposal request
function requestDisposal(agencyName) {
    alert(`Disposal request placed for ${agencyName}`);
}

// Handle search functionality
document.getElementById('search').addEventListener('input', function() {
    let filter = this.value.toLowerCase();
    let agencies = document.querySelectorAll('.agency');
    agencies.forEach(agency => {
        let name = agency.textContent.toLowerCase();
        agency.style.display = name.includes(filter) ? 'flex' : 'none';
    });
});

// Fetch agencies when the page loads
fetchAgencies();
