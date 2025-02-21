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
  updateDoc,
  query,
  collection,
  getDocs,
  where,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const agencyId = user.uid;
      await fetchAgencyData(agencyId);
      await fetchCurrentOrders(agencyId);
    } else {
      window.location.href = '../Login/login.html';
    }
  });
});

// Fetch agency details
async function fetchAgencyData(agencyId) {
  try {
    const agencyRef = doc(db, 'agencyLogin', agencyId);
    const agencySnap = await getDoc(agencyRef);
    if (agencySnap.exists()) {
      const data = agencySnap.data();
      displayAgencyData(data);
    } else {
      console.error('No agency data found');
    }
  } catch (error) {
    console.error('Error fetching agency data:', error);
  }
}

function displayAgencyData(data) {
  document.getElementById('display-name').textContent = data.name || '';
  document.getElementById('display-email').value = data.email || '';
  document.getElementById('full-name').value = data.name || '';
  document.getElementById('contact').value = data.contact || '';
  document.getElementById('address').value = data.address || '';
}


async function saveAgencyData() {
  const agencyId = auth.currentUser.uid;
  const agencyRef = doc(db, 'agencyLogin', agencyId);
  try {
    await updateDoc(agencyRef, {
      name: document.getElementById('full-name').value,
      contact: document.getElementById('contact').value,
      address: document.getElementById('address').value,
    });
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating agency data:', error);
  }
}

document.getElementById('save-button').addEventListener('click', saveAgencyData);

async function fetchCurrentOrders(agencyId) {
  try {
    const agencyRef = doc(db, 'agencyLogin', agencyId);
    const agencySnap = await getDoc(agencyRef);
    if (!agencySnap.exists()) return;

    const agencyName = agencySnap.data().name;
    const ordersQuery = query(
      collection(db, 'disposalRequests'),
      where('agencyName', '==', agencyName)
    );
    const ordersSnapshot = await getDocs(ordersQuery);

    const ordersContainer = document.getElementById('current-orders');
    ordersContainer.innerHTML = '';

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      const orderElement = document.createElement('div');
      orderElement.classList.add('order-item');
      orderElement.innerHTML = `
        <p><strong>User Name:</strong> ${order.name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Contact:</strong> ${order.contact}</p>
      `;
      ordersContainer.appendChild(orderElement);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

document.getElementById('signOut-button').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = '../Login/login.html';
    })
    .catch((error) => console.error('Logout error:', error));
});
