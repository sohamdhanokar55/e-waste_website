// Import the necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

// Firebase configuration
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
document.querySelector('.disposalForm').style.display = 'none';
// Function to fetch agencies from Firestore
function fetchAgencies() {
  const agencyList = document.getElementById('agencyList');
  agencyList.innerHTML = ''; // Clear any existing list items before adding new ones

  // Fetch all agencies from Firestore
  getDocs(collection(db, 'agencyLogin'))
    .then(snapshot => {
      // Log the snapshot docs array
      console.log('Snapshot docs:', snapshot.docs); // Log all docs to ensure we have access to them

      if (snapshot.empty) {
        console.log('No agencies found.');
        agencyList.innerHTML = '<p>No agencies found.</p>';
      } else {
        // Loop through the docs array and log individual documents
        snapshot.docs.forEach(doc => {
          console.log('Document ID:', doc.id); // Log document ID
          const agency = doc.data();
          console.log('Agency data:', agency); // Log the agency data

          if (agency.firstName && agency.districtName) {
            const li = document.createElement('li');
            li.classList.add('agency');
            li.innerHTML = `<span>${agency.firstName} - ${agency.districtName}</span>`;
            li.onclick = () =>
              showDetails(
                agency.firstName,
                agency.districtName,
                agency.email,
                agency.contact,
                doc.id
              );
            agencyList.appendChild(li);
          } else {
            console.log('Missing required fields in agency document:', doc.id);
          }
        });
      }
    })
    .catch(error => {
      console.error('Error fetching agencies: ', error);
    });
}

// Function to show agency details
function showDetails(firstName, districtName, email, contact, agency) {
  const detailsDiv = document.getElementById('agencyDetails');
  console.log(agency);
  detailsDiv.innerHTML = `
        <h3 id="agencyName">${firstName}</h3>
        <p><strong>District:</strong> ${districtName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <button class="select-btn" onclick="fetchFormAgencies('${agency}')">Place Disposal Request</button>

    `;
  detailsDiv.style.display = 'block';
  //   document
  //     .querySelector('.select-btn')
  //     .addEventListener('click', fetchFormAgencies(agencyId));
}

document.getElementById('search').addEventListener('input', function () {
  let filter = this.value.toLowerCase();
  let agencies = document.querySelectorAll('.agency');
  agencies.forEach(agency => {
    let name = agency.textContent.toLowerCase();
    agency.style.display = name.includes(filter) ? 'flex' : 'none';
  });
});

fetchAgencies();

// Display.js

window.fetchFormAgencies = function (agencyId) {
  document.querySelector('.disposalForm').style.display = 'flex';
  document.querySelector('.agencySearch').style.display = 'none';

  getDocs(collection(db, 'agencyLogin'))
    .then(snapshot => {
      const doc = snapshot.docs.find(doc => doc.id === agencyId);
      if (doc) {
        const agency = doc.data();
        showFormDetails(
          agency.firstName,
          agency.districtName,
          agency.email,
          agency.contact
        );
      } else {
        console.error('Agency not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching agencies: ', error);
    });
};

function showFormDetails(firstName, districtName, email, contact) {
  const detailsDiv = document.querySelector('.agency-Details');
  console.log(detailsDiv);
  detailsDiv.innerHTML = `
        <p><strong>Agency Name:</strong> ${firstName}</p>
      <p><strong>District:</strong> ${districtName}</p>
      <p><strong>Email:</strong>${email}</p>
      <p><strong>Contact:</strong> ${contact}</p>
    `;
}

// Accepting user data
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const agencyName = document.getElementById('agencyName').textContent;

    try {
      // Store data in Firestore
      await addDoc(collection(db, 'disposalRequests'), {
        name: name,
        address: address,
        contact: contact,
        email: email,
        agencyName: agencyName,
      });
      alert('Form submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  });
});
