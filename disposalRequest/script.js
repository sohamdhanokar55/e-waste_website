// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  where,
  query,
  collection,
  getDocs,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

// Firebase config and initialization
const firebaseConfig = {
  apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
  authDomain: 'e-waste-86617.firebaseapp.com',
  projectId: 'e-waste-86617',
  storageBucket: 'e-waste-86617.firebasestorage.app',
  messagingSenderId: '558005114520',
  appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
  measurementId: 'G-EW6GZCDY30',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const showAgencies=function(){
    const agencyList=document.querySelector('.agencies');
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
                        
                        // li.classList.add('agency');
                        li.innerHTML = `
                            <div class="card card-compact bg-base-100 w-96 shadow-xl" onclick="agencyDetails('${doc.id}')" >
                            <figure>
                                <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes" />
                            </figure>
                            <div class="card-body">
                                <h2 class="card-title">${agency.firstName}</h2>
                                <p id="agencyEmail">${agency.email}</p>
                                <div class="card-actions justify-end">
                                <button class="btn btn-primary" id="knowMore">Know More</button>
                                </div>
                            </div>
                            </div>
                       `;
                        
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

// Show the single agency details
window.agencyDetails= async(agencyId)=>{

    localStorage.setItem('agencyId',agencyId);

    const docRef = doc(db, 'agencyLogin', agencyId);
    const docSnap = await getDoc(docRef);
    const agency=docSnap.data();
    // document.querySelector('.disposalForm').style.display = 'flex';
    document.querySelector('.agencies').style.display = 'none';



    const currentDate=new Date();
    const prevDate=new Date();
    const nextDate=new Date();
    const fdate=new Date();

    prevDate.setDate(currentDate.getDate()+6)
    nextDate.setDate(currentDate.getDate()+8)
    fdate.setDate(currentDate.getDate()+7)
    const formatDate = (date) => date.toDateString();

    
    

    const dateForm = document.getElementById('dateForm');
    if (dateForm) {
        const dates = document.createElement('div');
        dates.innerHTML = `
        
    <h2 class="text-xl font-bold text-center">E-Waste Disposal Request</h2>

    <form id="eWasteForm" class="space-y-4 w-full">
        <!-- User Details -->
        <div>
            <label for="userName" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="userName" name="userName" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
        </div>

        <div>
            <label for="contact" class="block text-sm font-medium text-gray-700">Contact</label>
            <input type="tel" id="contact" name="contact" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
        </div>

        <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <textarea id="address" name="address" rows="3" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required></textarea>
        </div>

        <!-- E-Waste Details -->
        <div>
            <label for="eWasteAmount" class="block text-sm font-medium text-gray-700">E-Waste Disposal Request (in kg)</label>
            <input type="number" id="eWasteAmount" name="eWasteAmount" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
        </div>

        <div>
            <label for="eWasteTypes" class="block text-sm font-medium text-gray-700">Types of E-Waste</label>
            <select id="eWasteTypes" name="eWasteTypes" class="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled selected>Select a type</option>
                <option value="small-electronics">Small Electronics</option>
                <option value="large-appliances">Large Appliances</option>
                <option value="computers">Computers</option>
                <option value="mobile-phones">Mobile Phones</option>
                <option value="other">Other</option>
            </select>
            <p class="mt-2 text-sm text-blue-500">
                <a href="https://www.epa.gov/recycle/electronics-donation-and-recycling" target="_blank" class="underline">
                    What are types of E-waste?
                </a>
            </p>
        </div>
<div class="flex flex-col items-center space-y-4">
    <div class="space-y-2">
        <label class="flex items-center space-x-2">
            <input
                type="radio"
                name="dates"
                id="prevDate"
                class="form-radio text-blue-600 focus:ring-blue-500"
            />
            <span id="prevDateLabel" class="text-sm font-medium text-gray-700"></span>
        </label>
        <label class="flex items-center space-x-2">
            <input
                type="radio"
                name="dates"
                id="currDate"
                class="form-radio text-blue-600 focus:ring-blue-500"
            />
            <span id="currDateLabel" class="text-sm font-medium text-gray-700"></span>
        </label>
        <label class="flex items-center space-x-2">
            <input
                type="radio"
                name="dates"
                id="nextDate"
                class="form-radio text-blue-600 focus:ring-blue-500"
            />
            <span id="nextDateLabel" class="text-sm font-medium text-gray-700"></span>
        </label>
    </div>
        <!-- Submit Button -->
        
            <button type="submit" id="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Submit Request
            </button>
        
    </form>
</div>


             `;
        dateForm.appendChild(dates);

        document.getElementById('prevDateLabel').textContent = formatDate(prevDate);
        document.getElementById('currDateLabel').textContent = formatDate(fdate);
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
                const detailsDiv = document.getElementById('agencyDetails1');
                detailsDiv.innerHTML = `
                    <div class="section-1">
          <div class="agency-name">
             <h3 id="agencyName">${agency.firstName}</h3>
          </div>
          <div class="disposal-button">
             <button class="select-btn" onclick="fetchFormAgencies('${agency.agencyId}')">Place Disposal Request</button>
          </div> 
        </div>
        <div class="section-2">
            <div class="Image-1-section">
              <div class="img-container">
               
              </div>
            </div>
            <div class="Image-2-section">
              <div class="img-container">
               
              </div>
              <div class="img-container">
               
              </div>
              <div class="img-container">
                
              </div>
              <div class="img-container">
                
              </div>
            </div>
            <div class="Image-3-section">
                <div class="description">
                  <p><strong>State:</strong> ${agency.stateName}</p>
                  <p><strong>Email:</strong></p><p id="agencyEmail">${agency.email}</p>
                  <p><strong>Contact:</strong> ${agency.contact}</p>
                </div>
            </div>
            <div class="Image-4-section">
                <div class="mapping">
                    <div id="map"></div>
                </div>
            </div>
        </div>
                `;
            } else {
                console.error('Agency not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching agencies: ', error);
        });

        console.log('hello');
        
            const form = document.getElementById('eWasteForm'); // Target the form
            if (form) {
                console.log('Form exists');
                form.addEventListener('submit', async function (event) {
                    event.preventDefault(); // Prevent the default form submission
        
                    // Get form values
                    const name = document.getElementById('userName').value;
                    const address = document.getElementById('address').value;
                    const contact = document.getElementById('contact').value;
                    const email = document.getElementById('email').value;
                    const eWasteAmount = document.getElementById('eWasteAmount').value;
                    const eWasteTypes = document.getElementById('eWasteTypes').value;
                    const agencyName=document.getElementById('agencyName').textContent;
                    const agencyEmail=document.getElementById('agencyEmail').textContent;
                    console.log(agencyEmail);
                    console.log(agencyName);
                    const selectedDate = document.querySelector('input[name="dates"]:checked');
                    const selectedDateValue = selectedDate ? selectedDate.nextElementSibling.textContent : null;
        
                    if (!selectedDateValue) {
                        alert('Please select a date for disposal.');
                        return;
                    }
        
                    try {
                        // Save data to Firestore
                        await addDoc(collection(db, 'disposalRequests'), {
                            name: name,
                            address: address,
                            contact: contact,
                            email: email,
                            eWasteAmount: eWasteAmount,
                            eWasteTypes: eWasteTypes,
                            disposalDate: selectedDateValue,
                            agencyName:agencyName,
                            agencyEmail:agencyEmail,
                            createdAt: new Date().toISOString() // Optional: timestamp
                        });
        
                        alert('Form submitted successfully!');
                        // form.reset(); // Reset the form
                    } catch (error) {
                        console.error('Error saving data: ', error);
                        alert('Failed to submit the form. Please try again.');
                    }
                });
            } else {
                console.error('Form #eWasteForm not found in the DOM.');
            };




}

// Show agencies
async function geocodeLocation(name) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`);
        const data = await response.json();

        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                name: data[0].display_name || name
            };
        } else {
            console.warn(`Geocoding failed for location: ${name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error geocoding location: ${name}`, error);
        return null;
    }
}

showAgencies();


// Fetch data for a specific agency and initialize the map
async function initializeMapForEmail(targetEmail) {
    try {
        console.log("Fetching Firestore documents...");

        // Get the collection reference
        const agencyCollection = collection(db, 'agencyLogin');

        // Get all documents in the collection
        const snapshot = await getDocs(agencyCollection);

        if (snapshot.empty) {
            console.error('Firestore collection is empty.');
            alert('No locations found in the database.');
            return;
        }

        // Find the document with the matching email
        let agencyData = null;
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(doc.data);
            if (data.email === targetEmail) {
                agencyData = data;
            }
        });

        if (!agencyData) {
            console.error(`No agency found with email: ${targetEmail}`);
            alert('No agency found with the given email.');
            return;
        }

        console.log("Agency data found:", agencyData);

        // Geocode the location name
        const locationName = agencyData.cityName;        ;
        const geocodedLocation = await geocodeLocation(locationName);

        if (!geocodedLocation) {
            console.error(`Failed to geocode location: ${locationName}`);
            alert('Failed to geocode the agency location.');
            return;
        }

        console.log("Geocoded location:", geocodedLocation);

        // Initialize the map at the geocoded location
        const map = L.map('map').setView([geocodedLocation.latitude, geocodedLocation.longitude], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Kleos Tech'
        }).addTo(map);

        // Add a marker for the agency location
        L.marker([geocodedLocation.latitude, geocodedLocation.longitude]).addTo(map)
            .bindPopup(`<b>${geocodedLocation.name}</b>`)
            .openPopup();
    } catch (error) {
        console.error('Error initializing the map:', error.message || error, error.stack);
        alert('Error fetching or processing agency data. Please try again.');
    }
}

// Call the function with the target email

document.querySelector('.agencies').addEventListener('click', function (event) {
    if (event.target && event.target.id === 'knowMore') {
        console.log('Rendered agency details:', document.querySelector('.agencies').innerHTML);

        const emailElement = document.getElementById('agencyEmail');
        console.log(emailElement);
        if (emailElement) {
            const email = emailElement.textContent.trim();
            console.log('Email:', email);
            initializeMapForEmail(email);
        } else {
            console.error('agencyEmail element not found!');
        }
    }
});

   


