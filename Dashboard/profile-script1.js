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
  deleteDoc,
  serverTimestamp,
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
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// Ensure the user is logged in before showing profile
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    if (user) {
        const userId = user.uid;
        const agencyInstance = new isAgencyLogin();
        agencyInstance.fetchUserData(userId);
        agencyInstance.showOrderRequests(); // Ensure orders are displayed
      }      
  });
});

// Class definition for isUserLogin
class isUserLogin {
  // Display all data on the dashboard
  constructor() {
    // document.addEventListener('DOMContentLoaded', this.showCurrentOrders);
  }
  fetchUserData(userId) {
    getDoc(doc(db, 'userLogin', userId))
      .then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          this.displayUserData(data);

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

  displayUserData(data) {
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
  }

   updatePersonalDetails(userId) {
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

  showCurrentOrders() {
    console.log('hello');
    const users = [];
    setTimeout(async () => {
      const email = document.getElementById('user-email').value;
      console.log(email);
      try {
        const disposalRequests = collection(db, 'disposalRequests');
        const contactQuery = query(
          disposalRequests,
          where('email', '==', email)
        );
        const querySnapshot = await getDocs(contactQuery);
        console.log(querySnapshot);
        querySnapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() });
        });

        users.forEach(user => {
          const orderList = document.createElement('div');
          orderList.innerHTML = `
          <h3>Current Orders</h3>
          <div class='agency-details'>
            <p><strong>Agency Name:</strong>${user.agencyName} </p>
            <p><strong>Address:</strong>${user.address}</p>
            <p><strong>Email:</strong>${user.email}</p>
            <p><strong>Contact:</strong>${user.contact}</p>
          </div>`;

          document.getElementById('current-orders').appendChild(orderList);
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 5000);
  }
}

// Class definition for isAgencyLogin
class isAgencyLogin {
  constructor() {
    
    
  }

  fetchUserData(userId) {
    console.log('hello');
    getDoc(doc(db, 'agencyLogin', userId))
      .then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          this.displayUserData(data);

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

  displayUserData(data) {
    document.getElementById('user-name').textContent =
      `Welcome,${data.firstName}` || '';

    document.getElementById('display-name').textContent =
      `${data.firstName} ` || '';

    document.getElementById('display-email').textContent = data.email;
    document.getElementById('user-email').value = data.email;

    document.getElementById('contact').value = data.contact || '';
    document.getElementById('full-name').value = data.contact || '';
    document.getElementById('full-name').value = `${data.firstName} ` || '';

    // document.getElementById('user-address').value = data.address || '';
    // document.getElementById('user-age').value = data.age || '';
    // document.getElementById('wallet-balance').textContent = `$${
    //   data.tokens || 0
    // }`;
    // document.getElementById('leaderboard-rank').textContent = `#${
    //   data.rank || 'N/A'
    // }`;
  }
   updatePersonalDetails(userId) {
    if (highlightEmptyFields()) {
      const updatedData = {
        firstName: document.getElementById('full-name').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('user-email').value,
        // address: document.getElementById('user-address').value,
        // age: document.getElementById('user-age').value,
      };  
  
      setDoc(doc(db, 'agencyLogin', userId), updatedData, { merge: true })
        .then(() => alert('Profile updated successfully!'))
        .catch(error => alert('Error updating profile: ' + error.message));
    } else {
      alert('Please fill in all fields.');
    }
  }


  showOrderRequests() {
    console.log('hello');
    const users = [];
    setTimeout(async () => {
    const email = document.getElementById('user-email').value.trim();
      console.log(agencyName);
      try {
        const disposalRequests = collection(db, 'disposalRequests');

        const contactQuery = query(disposalRequests, where('agencyEmail', '==', email));

        const querySnapshot = await getDocs(contactQuery);

        console.log(querySnapshot.size);
        querySnapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() });
        });
        console.log(users);
        users.forEach(user => {
          const orderList = document.createElement('div');
          const uid = user.id;
          orderList.innerHTML = `
          <h3>Current Orders</h3>
<div class="agency-details" style="display: flex; justify-content: space-between; align-items: center;" >
  <div>
    <p><strong>User Name:</strong> ${user.name}</p>
    <p><strong>Address:</strong> ${user.address}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Contact:</strong> ${user.contact}</p>
  </div>
  <div>
    <button style="margin-right: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;" class='schedule-btn'id="${uid}">
      Schedule
    </button>
    <button style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" class='deny-btn'id="${uid}">
      Deny
    </button>
  </div>
</div>
          </div>`;
          document.getElementById('current-orders').appendChild(orderList);

          orderList
            .querySelector('.schedule-btn')
            .addEventListener('click', async (event)=> {

              const modal = document.getElementById('scheduleModal');
              modal.style.display='flex';
              const closeModalBtn = document.getElementById('closeModalBtn');
              const pickupOption = document.getElementById('pickupOption');
              const calendarSection = document.getElementById('calendarSection');

              // Display calendar
              closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
              // Show or hide calendar based on dropdown selection
              pickupOption.addEventListener('change', () => {
                if (pickupOption.value === 'schedule') {
                  calendarSection.style.display = 'block';
                } else {
                  calendarSection.style.display = 'none';
                }
              });
              // Ends

              const uid = event.target.getAttribute('id');
              const docRef = doc(db, 'disposalRequests', uid);
              const docSnap = await getDoc(docRef);

              const user=docSnap.data();

              console.log(uid);
              const orderList1 = document.createElement('div');
              orderList1.innerHTML = `<div>
    <p><strong>User Name:</strong> ${user.name}</p>
    <p><strong>Address:</strong> ${user.address}</p>
    <p>Email:<strong id='userEmail'> ${user.email}</p>
    <p><strong>Contact:</strong> ${user.contact}</p>
  </div>`;
              console.log(orderList1);
              document.querySelector('.showDisposal').innerHTML = '';
              document.querySelector('.showDisposal').appendChild(orderList1);


              // Save button pressed
              const saveBtn=document.getElementById('saveModalBtn')
              saveBtn.addEventListener('click',function async(){
              const email=document.getElementById('userEmail').textContent;
              let schedulePickup=document.getElementById('pickupDate').value;
              schedulePickup=schedulePickup===''?'Pending':schedulePickup;
                console.log(email);
                addDoc(collection(db, "pickupTimeline"), {
                  userEmail:email,
                  schedulePickup: schedulePickup,
                  timestamp: serverTimestamp()
              })
              .then(() => {
                  alert("Timeline saved successfully!"); // Alert message after saving
              
                  // Hide form after saving
                  document.getElementById("scheduleModal").style.display = "none";
              
                  // Change button text to "Edit Timeline"
              })
              .catch((error) => {
                  console.error("Error saving data: ", error);
              });
              
              });

              // Retrive dispposal request data
             
              

            });


          orderList
          document.querySelectorAll('.deny-btn').forEach(button => {
            button.addEventListener('click', async event => {
              try {
                const isConfirm = confirm('Are you sure you want to delete this Disposal Request?');
                if (isConfirm) {
                  const uid = event.target.getAttribute('id');
                  if (!uid) {
                    console.error('No UID found for this disposal request.');
                    return;
                  }
          
                  const docRef = doc(db, 'disposalRequests', uid);
                  await deleteDoc(docRef);
          
                  // Optionally, remove the deleted request from the UI
                  event.target.closest('.disposal-request-item').remove();
                }
              } catch (err) {
                console.error('Error deleting disposal request:', err);
              }
            });
          });
          
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 3000);
  }
}

// Function to determine if it’s a user or agency
const isUser = async userId => {
  const documentId = userId;
  const collections = ['userLogin', 'agencyLogin'];
  let currentCollection;

  for (const collectionName of collections) {
    const docRef = doc(db, collectionName, documentId);

    const docSnapshot = await getDoc(docRef);
    console.log(docSnapshot);
    if (docSnapshot.exists()) {
      currentCollection = collectionName;
      break;
    }
  }
  
console.log(currentCollection);
  if (currentCollection === 'userLogin') {
    const userLoginInstance = new isUserLogin(); // Works now
    userLoginInstance.fetchUserData(userId);
    userLoginInstance.showCurrentOrders();
    document
  .getElementById('save-button')
  .addEventListener('click', () => userLoginInstance.updatePersonalDetails(userId));
  } else {
    const isAgencyLoginInstance = new isAgencyLogin();
    isAgencyLoginInstance.fetchUserData(userId);
    isAgencyLoginInstance.showOrderRequests();
    document
  .getElementById('save-button')
  .addEventListener('click', () => isAgencyLoginInstance.updatePersonalDetails(userId));
  }
};

// Compulsoruy Functions

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

// Fetch and display user details

// Update personal details


// Logout functionality
document.getElementById('signOut-button').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../Login/login.html"; // Redirect to login page
    })
    .catch(error => console.error('Logout error:', error));
});


// Modal Popup

// Ensure the form is hidden on page load and add event listeners




