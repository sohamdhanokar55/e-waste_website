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

var timeline=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timeline Example</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 py-10">

<div class="container mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Timeline</h1>
    <div class="relative">
        <div class="border-l-2 border-gray-300">
            <!-- Timeline Item 1 -->
            <div class="mb-8 ml-4">
                <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2"></div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="font-semibold text-lg">Event Title 1</h2>
                    <p class="text-gray-600">Description of the event that happened on this date.</p>
                    <span class="text-gray-500 text-sm">Date: January 1, 2023</span>
                </div>
            </div>

            <!-- Timeline Item 2 -->
            <div class="mb-8 ml-4">
                <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2"></div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="font-semibold text-lg">Event Title 2</h2>
                    <p class="text-gray-600">Description of the event that happened on this date.</p>
                    <span class="text-gray-500 text-sm">Date: February 15, 2023</span>
                </div>
            </div>

            <!-- Timeline Item 3 -->
            <div class="mb-8 ml-4">
                <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2"></div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="font-semibold text-lg">Event Title 3</h2>
                    <p class="text-gray-600">Description of the event that happened on this date.</p>
                    <span class="text-gray-500 text-sm">Date: March 10, 2023</span>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
`;



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

    document.getElementById('contact').value = data.contactNumber || '';
    document.getElementById('full-name').value = data.contactNumber || '';
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
              <p><strong>Contact:</strong> ${user.contactNumber}</p>
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
              document.querySelector('.userMoal').innerHTML='';
              userModalData.innerHTML='';
              userModalData.innerHTML=`
              <p><strong>Agency Name:</strong> ${user.agencyName}</p>
              <p><strong>Address:</strong> ${user.address}</p>
              <p>Email:<strong id='userEmailId'> ${user.email}</strong></p>
              <p><strong>Contact:</strong> ${user.contactNumber}</p>
              $
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

                console.log("Retrieved Users:", users1[0]);

                  
                  userModalData.innerHTML=`<p><strong>Agency Name:</strong> ${user.agencyName}</p>
                  <p><strong>Address:</strong> ${user.address}</p>
                  <strong>Email:</strong><div> ${user.email}</div>
                  <p><strong>Contact:</strong> ${user.contactNumber}</p>
                  <p><strong>Pickup Status: </strong>${users1[0].scheduleStatus}</p>
                  <p>Pickup scheduled on-${users1[0].scheduleDate}
                  ${timeline}`;
                  
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

  addBio(){`
    `

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
          <div style="display: flex; flex-direction: column; align-items: center; width: 95%; padding: 10px;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div style="margin-bottom: 15px;">
            <img src="Images/profilepic.jpg" alt="Profile Picture" style="width: 60px; height: 60px; border-radius: 50%;">
        </div>
        <div style="text-align: center; margin-bottom: 15px;">
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Product-Name: <b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Name: ${user.name}<b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Email: ${user.email}<b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Contact:${user.contact} <b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Address: ${user.address}<b></b></p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; justify-content: center;">
            <button id="${uid}" class="schedule-btn" style="background-color: #007bff; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Schedule</button>
            <button id="${uid}" class="deny-btn" style="background-color: #dc3545; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Deny</button>
        </div>
    </div>
</div>
`;        
          document.getElementById('current-orders').appendChild(orderList);

          orderList
            .querySelector('.schedule-btn')
            .addEventListener('click', async (event)=> {

              const modal = document.getElementById('schedulePopup');
              modal.style.display='flex';
              const closeModalBtn = document.getElementById('closePopupBtn');
              
              closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
              const uid = event.target.getAttribute('id');
              const docRef = doc(db, 'disposalRequests', uid);
              const docSnap = await getDoc(docRef);

              const user=docSnap.data();

              console.log(uid);
              const orderList1 = document.createElement('div');
              orderList1.innerHTML='';
              orderList1.innerHTML = `<div>
              <p><strong>User Name:</strong> ${user.name}</p>
              <p><strong>Address:</strong> ${user.address}</p>
              <p>Email:<strong id='userEmail'> ${user.email}</p>
              <p><strong>Contact:</strong> ${user.contact}</p>
              <p>Schedule Requested:<div id="date"> ${user.disposalDate}</div></p>
              <p>Assign PickupAgent: <p>
              
              </div>`;
              document.querySelector('.showDisposal').innerHTML='';
              document.querySelector('.showDisposal').appendChild(orderList1);


              // Save button pressed
              const approve=document.querySelector('.approved')
              approve.addEventListener('click',function async(){
              const email=document.getElementById('userEmail').textContent;
              const date=document.getElementById('date').textContent;
                addDoc(collection(db, "pickupTimeline"), {
                  userEmail:email,
                  scheduleStatus: "Request Approved",
                  scheduleDate: date,
                  timestamp: serverTimestamp()
              })
              .then(() => {
                  alert("Request Approved successfully!"); // Alert message after saving
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
                  await deleteDoc(docRef).then(()=>{
                    alert('Deleted Successfully');
                    location.reload();
                  });

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

class isVolunteerLogin{
  fetchUserData(userId) {
    console.log('hello');
    getDoc(doc(db, 'volunteerLogin', userId))
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
          <div style="display: flex; flex-direction: column; align-items: center; width: 95%; padding: 10px;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div style="margin-bottom: 15px;">
            <img src="Images/profilepic.jpg" alt="Profile Picture" style="width: 60px; height: 60px; border-radius: 50%;">
        </div>
        <div style="text-align: center; margin-bottom: 15px;">
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Product-Name: <b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Name: ${user.name}<b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Email: ${user.email}<b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Contact:${user.contact} <b></b></p>
            <p style="font-size: 12px; line-height: 22px; margin: 5px 0;">Address: ${user.address}<b></b></p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; justify-content: center;">
            <button id="${uid}" class="schedule-btn" style="background-color: #007bff; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Schedule</button>
            <button id="${uid}" class="deny-btn" style="background-color: #dc3545; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Deny</button>
        </div>
    </div>
</div>
`;        
          document.getElementById('current-orders').appendChild(orderList);

          orderList
            .querySelector('.schedule-btn')
            .addEventListener('click', async (event)=> {

              const modal = document.getElementById('schedulePopup');
              modal.style.display='flex';
              const closeModalBtn = document.getElementById('closePopupBtn');
              
              closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
              const uid = event.target.getAttribute('id');
              const docRef = doc(db, 'disposalRequests', uid);
              const docSnap = await getDoc(docRef);

              const user=docSnap.data();

              console.log(uid);
              const orderList1 = document.createElement('div');
              orderList1.innerHTML='';
              orderList1.innerHTML = 
              `<div>
              <p><strong>User Name:</strong> ${user.name}</p>
              <p><strong>Address:</strong> ${user.address}</p>
              <p>Email:<strong id='userEmail'> ${user.email}</p>
              <p><strong>Contact:</strong> ${user.contact}</p>
              <p>Schedule Requested:<div id="date"> ${user.disposalDate}</div></p>
              <p>Assign PickupAgent: <p>
              </div>`;
              document.querySelector('.showDisposal').innerHTML='';
              document.querySelector('.showDisposal').appendChild(orderList1);


              // Save button pressed
              const approve=document.querySelector('.approved')
              approve.addEventListener('click',function async(){
              const email=document.getElementById('userEmail').textContent;
              const date=document.getElementById('date').textContent;
                addDoc(collection(db, "pickupTimeline"), {
                  userEmail:email,
                  scheduleStatus: "Request Approved",
                  scheduleDate: date,
                  timestamp: serverTimestamp()
              })
              .then(() => {
                  alert("Request Approved successfully!"); // Alert message after saving
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
                  await deleteDoc(docRef).then(()=>{
                    alert('Deleted Successfully');
                    location.reload();
                  });

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
  const collections = ['userLogin', 'agencyLogin','volunteerLogin'];
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
  } 
  else if(currentCollection === 'agencyLogin') {
    const isAgencyLoginInstance = new isAgencyLogin();
    isAgencyLoginInstance.fetchUserData(userId);
    isAgencyLoginInstance.showOrderRequests();
    document
  .getElementById('save-button')
  .addEventListener('click', () => isAgencyLoginInstance.updatePersonalDetails(userId));
  }
  else{
    const isVolunteerLoginInstance = new isVolunteerLogin();
    isVolunteerLoginInstance.fetchUserData(userId);
    isVolunteerLoginInstance.showOrderRequests();
    document
  .getElementById('save-button')
  .addEventListener('click', () => isVolunteerLoginInstance.updatePersonalDetails(userId));
    
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


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwnorfkwt/upload";
const CLOUDINARY_UPLOAD_PRESET = "Unsigned_upload";

// Select Elements
const profilePic = document.getElementById("profilePic");
const profileInput = document.getElementById("profileInput");

// Function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

// Function to update user's document in Firestore
const updateUserProfilePic = async (email, imageUrl) => {
    try {
        const userQuery = query(collection(db, "agencyLogin"), where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.warn("No user found in agencyLogin collection.");
            return;
        }

        const userDoc = userSnapshot.docs[0].ref;
        await updateDoc(userDoc, { profilePic: imageUrl });

        console.log("Profile picture updated successfully.");
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
};

// Function to handle image upload
profileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file) {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to upload a profile picture.");
            return;
        }

        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
            profilePic.src = imageUrl; // Update UI
            await updateUserProfilePic(user.email, imageUrl); // Update Firestore
        }
    }
});



// Fetch and display the user's profile picture if available
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userQuery = query(collection(db, "agencyLogin"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData.profilePic) {
                profilePic.src = userData.profilePic; // Load existing profile picture
            }
        }
    }
});
