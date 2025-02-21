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
    console.log(user);
    isUser(user.uid);
    if (user) {
      const userId = user.uid;

      document
        .getElementById('save-button')
        .addEventListener('click', () => updatePersonalDetails(userId));
    } else {
      // Redirect to login page if not authenticated
      window.location.href = '../index.html';
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
    document.getElementById('full-name').value =
      `${data.firstName}` || '';

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
          <div class='agency-details' style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p><strong>Agency Name:</strong> ${user.agencyName}</p>
              <p><strong>Address:</strong> ${user.address}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Contact:</strong> ${user.contact}</p>
            </div>
            <button id="${user.id}" class='more-info' style="padding: 8px 12px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
              More Info
            </button>
          </div>
          `; 
          document.getElementById('current-orders').appendChild(orderList);

          document.querySelector('.more-info').addEventListener('click', async (event)=> {
            const modal = document.querySelector('.modal-user');
            const closeModalBtn = document.getElementById('closeModalBtn');
              modal.style.display = 'flex';
              closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
              const uid = event.target.getAttribute('id');
              const docRef = doc(db, 'disposalRequests', uid);
              const docSnap = await getDoc(docRef);
              const userModalData=document.createElement('div');
              userModalData.innerHTML=`
              <p><strong>Agency Name:</strong> ${user.agencyName}</p>
              <p><strong>Address:</strong> ${user.address}</p>
              <p>Email:<strong id='userEmailId'> ${user.email}</strong></p>
              <p><strong>Contact:</strong> ${user.contact}</p>
              `;
              document.querySelector('.userMoal').appendChild(userModalData);
              


              const userEmail = document.getElementById('userEmailId').textContent;
              const userEmailNormalized = userEmail.toLowerCase();

              const pickupTimeline = collection(db, 'pickupTimeline');
              const users1 = [];

              console.log("User Email:", userEmailNormalized);

              const contactQuery1 = query(
                pickupTimeline,
                where('userEmail', '==', userEmailNormalized)
              );

              console.log("Query Object:", contactQuery1);

              try {
                const querySnapshot1 = await getDocs(contactQuery1);
                console.log("Query Snapshot Size:", querySnapshot1.size);

                querySnapshot1.forEach((doc) => {
                  users1.push({ id: doc.id, ...doc.data() });
                });

                console.log("Retrieved Users:", users1);

                userModalData.innerHTML=`<p><strong>Agency Name:</strong> ${user.agencyName}</p>
                  <p><strong>Address:</strong> ${user.address}</p>
                  <strong>Email:</strong><div id='userEmailId'> ${user.email}</div>
                  <p><strong>Contact:</strong> ${user.contact}</p>
                  <p><strong>Pickup Status: </strong>${users1[0].schedulePickup}</p>`
                            ;

              } catch (error) {
                console.error("Error fetching documents:", error);
              }          
          });
        
        
        
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 3000);
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
      const agencyName = document.getElementById('full-name').value.trim();
      console.log(agencyName);
      try {
        const disposalRequests = collection(db, 'disposalRequests');

        const contactQuery = query(
          disposalRequests,
          where('agencyName', '==', agencyName)
        );

        const querySnapshot = await getDocs(contactQuery);

        console.log(querySnapshot.size);
        querySnapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() });
        });
        console.log(users);
        users.forEach(user => { //
          const orderList = document.createElement('div');
          const uid = user.id;
          orderList.innerHTML = `
          <div style="box-shadow:inset 0px 0px 12px rgba(0, 0, 0, 0.9); width:300px;">
<p style="font-weight: bolder; font-size: 20px; margin-bottom:10px; padding-top: 20px;">Current Orders</p>
<div class="agency-details" style="display: flex;flex-direction: column; justify-content: space-between; align-items: center; row-gap: 20px; " >
  <div>
    <p style="font-size: 20px; margin-bottom:10px;text-align:center;"><strong>User Name:</strong> ${user.name}</p>
    <p style="font-size: 20px; margin-bottom:10px;text-align:center;"><strong>Address:</strong> ${user.address}</p>
    <p style="font-size: 20px; margin-bottom:10px;text-align:center;"><strong>Email:</strong> ${user.email}</p>
    <p style="font-size: 20px; margin-bottom:10px;text-align:center;"><strong>Contact:</strong> ${user.contact}</p>
  </div>
  <div> 
    <button style="margin-right: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;" class='schedule-btn'id="${uid}">
      Schedule
    </button>
    <button style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;" class='deny-btn'id="${uid}">
      Deny
    </button>
  </div>
</div>
</div>
          </div>`;
          document.getElementById('current-orders').appendChild(orderList);

          orderList
            .querySelector('.schedule-btn')
            .addEventListener('click', async (event)=> {

              const modal = document.getElementById('schedulePopup');
              modal.style.display='flex';
              const closeModalBtn = document.getElementById('closePopupBtn');
              const pickupOption = document.getElementById('pickupChoice');
              const calendarSection = document.getElementById('calendarContainer');

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
                  document.getElementById("schedulePopup").style.display = "none";
              
                  // Change button text to "Edit Timeline"
              })
              .catch((error) => {
                  console.error("Error saving data: ", error);
              });
              
              });
            });


          orderList
            .querySelector('.deny-btn')
            .addEventListener('click', async event => {
              try {
                const isconfirm = confirm(
                  'Are you sure you want to delete Disposal Request'
                );
                if (isconfirm) {
                  const uid = event.target.getAttribute('id');
                  const docRef = doc(db, 'disposalRequests', uid);
                  await deleteDoc(docRef);
                }
              } catch (err) {
                console.error(err);
              }
            });
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 3000);
  }
}


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
    const userLoginInstance = new isUserLogin(); 
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
      input.style.border = ''; 
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
      window.location.href = "../index.html"; // Redirect to login page
    })
    .catch(error => console.error('Logout error:', error));
});
