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

// Ensure the user is logged in before showing profile
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    console.log(user);
    if (user) {
      const userId = user.uid;
      fetchUserData(userId);
      document
        .getElementById('save-button')
        .addEventListener('click', () => updatePersonalDetails(userId));
    } else {
      // Redirect to login page if not authenticated
      window.location.href = '../Login/login.html';
    }
  });
});
// TO display all the data on Dashboard
const displayUserData = data => {
  document.getElementById('user-name').textContent =
    `Welcome,${data.firstName}` || '';

  document.getElementById('display-name').textContent =
    `${data.firstName} ${data.lastName}` || '';

  document.getElementById('display-email').textContent = data.email;
  document.getElementById('user-email').value = data.email;

  document.getElementById('contact').value = data.contact || '';
  document.getElementById('full-name').value = data.contact || '';
  document.getElementById('full-name').value =
    `${data.firstName} ${data.lastName}` || '';

  // document.getElementById('user-address').value = data.address || '';
  // document.getElementById('user-age').value = data.age || '';
  // document.getElementById('wallet-balance').textContent = `$${
  //   data.tokens || 0
  // }`;
  // document.getElementById('leaderboard-rank').textContent = `#${
  //   data.rank || 'N/A'
  // }`;
};

// Fetch and display user details
function fetchUserData(userId) {
  getDoc(doc(db, 'userLogin', userId))
    .then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data);
        displayUserData(data);

        // updateOrderList('order-history', data.orderHistory || []);
        // updateOrderList('current-orders', data.currentOrders || []);
      } else {
        console.log('No user data found');
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}

// Highlight empty fields and return a validity status
function highlightEmptyFields() {
  let isValid = true;

  const fields = [{ id: 'full-name' }, { id: 'contact' }, { id: 'user-email' }];

  fields.forEach(field => {
    console.log(field);
    const input = document.getElementById(field.id);
    console.log(input);
    if (input.value.trim() === '') {
      input.style.border = '2px solid red'; // Highlight empty field
      isValid = false;
    } else {
      input.style.border = ''; // Remove highlight if field is not empty
    }
  });

  return isValid;
}

// Update personal details
function updatePersonalDetails(userId) {
  if (highlightEmptyFields()) {
    const updatedData = {
      firstName: document.getElementById('full-name').value,
      contact: document.getElementById('contact').value,
      email: document.getElementById('user-email').value,
      // address: document.getElementById('user-address').value,
      // age: document.getElementById('user-age').value,
    };

    setDoc(doc(db, 'userLogin', userId), updatedData, { merge: true })
      .then(() => alert('Profile updated successfully!'))
      .catch(error => alert('Error updating profile: ' + error.message));
  } else {
    alert('Please fill in all fields.');
  }
}

// Helper function to update orders lists
function updateOrderList(elementId, orders) {
  const list = document.getElementById(elementId);
  list.innerHTML = '';
  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `Order #${order.id} - ${order.status}`;
    list.appendChild(li);
  });
}

// Logout functionality
document.getElementById('signOut-button').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = '../Login/login.html'; // Redirect to login page
    })
    .catch(error => console.error('Logout error:', error));
});
