import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
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
    document.addEventListener('DOMContentLoaded', () => {
    const agencyList = document.querySelector('#agencyList');
   // Clear any existing list items before adding new ones
    if (agencyList) {
        agencyList.innerHTML = 'New Name';
    } else {
        console.log('Element #agencyName not found on this page.');
    }
    agencyList.innerHTML = ''; 
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

                    if (agency.firstName && agency.stateName) {
                        const li = document.createElement('li');
                        
                        li.classList.add('agency');
                        li.innerHTML = `<span>${agency.firstName} -${agency.cityName}, ${agency.stateName} </span>`;
                        li.onclick = () => {
                            // Show agency details in the modal
                            showDetails(
                                agency.firstName,
                                agency.stateName,
                                agency.email,
                                agency.contact,
                                doc.id,
                                
                            );
                        };
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
    });
    
    
}

// Function to show agency details in a modal
// Function to show agency details in a modal
async function showDetails(firstName, stateName, email, contact, agencyId) {
    const modal = document.getElementById('modal');
    const modalBody = modal.querySelector('.modal-body');

    // Fetch agency document to get images array
    const docRef = doc(db, 'agencyLogin', agencyId);
    const docSnap = await getDoc(docRef);
    let images = [];

    if (docSnap.exists()) {
        const agencyData = docSnap.data();
        images = agencyData.images || []; // Get images array or default to empty array
    } else {
        console.error('Agency document not found.');
    }

    modalBody.innerHTML = `
        <div class="section-1">
          <div class="agency-name">
             <h3 id="agencyName">${firstName}</h3>
          </div>
          <div class="disposal-button">
             <button class="select-btn" onclick="fetchFormAgencies('${agencyId}')">Place Disposal Request</button>
          </div> 
        </div>
        <div class="section-2">
            <div class="Image-1-section">
              <div class="img-container">
                <img src="${images[0] || ''}" alt="Agency Image 1">
              </div>
            </div>
            <div class="Image-2-section">
              <div class="img-container">
                <img src="${images[1] || ''}" alt="Agency Image 2">
              </div>
              <div class="img-container">
                <img src="${images[2] || ''}" alt="Agency Image 3">
              </div>
              <div class="img-container">
                <img src="${images[3] || ''}" alt="Agency Image 4">
              </div>
              <div class="img-container">
                <img src="${images[4] || ''}" alt="Agency Image 5">
              </div>
            </div>
            <div class="Image-3-section">
                <div class="description">
                  <p><strong>State:</strong> ${stateName}</p>
                  <p><strong>Email:</strong></p><p id='agencyEmail'> ${email}</p>
                  <p><strong>Contact:</strong> ${contact}</p>
                </div>
            </div>
            <div class="Image-4-section">
                <div class="mapping">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    `;

    openModal(modal); // Open the modal
}


// Function to open modal
function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

// Function to close modal
function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
}

// const openModalButtons = document.querySelectorAll('[data-modal-target]');
// const closeModalButtons = document.querySelectorAll('[data-close-button]');
// const overlay = document.getElementById('overlay');


// openModalButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const modal = document.querySelector(button.dataset.modalTarget);
//         openModal(modal);
//     });
// });

// overlay.addEventListener('click', () => {
//     const modals = document.querySelectorAll('.modal.active');
//     modals.forEach(modal => {
//         closeModal(modal);
//     });
// });

// closeModalButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const modal = button.closest('.modal');
//         closeModal(modal);
//     });
// });

// Function to fetch form agencies
window.fetchFormAgencies =  async (agencyId)=> {

    localStorage.setItem('agencyId',agencyId);

    const docRef = doc(db, 'agencyLogin', agencyId);
    const docSnap = await getDoc(docRef);
    const agency=docSnap.data();
    document.querySelector('.disposalForm').style.display = 'flex';
    document.querySelector('.agencySearch').style.display = 'none';
    document.querySelector('.modal').style.display='none';

    document.querySelector('.agencyDetials').innerHTML=`
       <p class="form-head"><strong cl>Agency Name:</strong><p id="agencyName" c> ${agency.firstName}</p></p>`;


    overlay.style.opacity='0';

    const currentDate=new Date();
    const prevDate=new Date();
    const nextDate=new Date();

    prevDate.setDate(currentDate.getDate()+6)
    nextDate.setDate(currentDate.getDate()+8)
    const formatDate = (date) => date.toDateString();

    
    

    const dateForm = document.getElementById('dateForm');
    if (dateForm) {
        const dates = document.createElement('div');
        dates.innerHTML = `
            
            <div class="date-select">
            <div>
            <label class="date-option">
                <input type="radio" name="dates" id="prevDate">
                <span id="prevDateLabel"></span>
            </label>
            <label class="date-option">
                <input type="radio" name="dates" id="currDate">
                <span id="currDateLabel"></span>
            </label>
            <label class="date-option">
                <input type="radio" name="dates" id="nextDate">
                <span id="nextDateLabel"></span>
            </label>
            </div>
            </div>
             <button class="submit" type="submit">Submit</button>
             `;
        dateForm.appendChild(dates);

        document.getElementById('prevDateLabel').textContent = formatDate(prevDate);
        document.getElementById('currDateLabel').textContent = formatDate(currentDate);
        document.getElementById('nextDateLabel').textContent = formatDate(nextDate);
    } else {
        console.error('Element #dateForm not found');
    }
    

    console.log(agencyId);
    getDocs(collection(db, 'agencyLogin'))
        .then(snapshot => {
            const doc = snapshot.docs.find(doc => doc.id === agencyId);
            if (doc) {
                const agency = doc.data();
                showFormDetails(
                    agency.firstName,
                    agency.stateName,
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

// Show form details for the selected agency
function showFormDetails(firstName, stateName, email, contact) {

    
    const detailsDiv = document.getElementById('agencyDetails');
    detailsDiv.innerHTML = `
        <p><strong>Agency Name:</strong> ${firstName}</p>
        <p><strong>State:</strong> ${stateName}</p>
        <strong>Email:</strong><p id="agencyEmail">${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        
    `;
}

// Accepting user data
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired');
    
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        // Get form values
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const contact = document.getElementById('contact').value;
        const email = document.getElementById('email').value;
        const agencyName = document.getElementById('agencyName').textContent;
    
        const selectedDate = document.querySelector('input[name="dates"]:checked');
        const selectedDateValue = selectedDate ? selectedDate.nextElementSibling.textContent : null;
    
        if (!selectedDateValue) {
            alert('Please select a date for disposal.');
            return; 
        }
    
        try {
            // Store data in Firestore
            await addDoc(collection(db, 'disposalRequests'), {
                name: name,
                address: address,
                contact: contact,
                email: email,
                agencyName: agencyName,
                scheduleDisposal: selectedDateValue, // Use the string value, not the HTMLInputElement
            });
            alert('Form submitted successfully!');
            form.reset();
        } catch (error) {
            console.error('Error saving data: ', error);
        }
    });
    
});



// Fetch agencies when page loads
fetchAgencies();