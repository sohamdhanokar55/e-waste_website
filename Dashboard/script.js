import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);
const user = auth.currentUser; //refers to the current user document id
const dbRef = collection(db, 'userLogin');

// DOM Init
const name = document.getElementById('name');
const date = new Date().toDateString();
document.getElementById('date').textContent = date;

// Functions

const displayName = async user => {
  const docR = doc(db, 'userLogin', user);
  const docSnap = await getDoc(docR);
  name.textContent = `Welcome,${docSnap.data().firstName}`;
};

const getUid = user => {
  console.log(user);
};
let uid;
let p = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      resolve(uid);
    } else {
      reject('Unable to sign in');
    }
  });
}).then(user => {
  displayName(user);
  uid = user;
});
onAuthStateChanged();
console.log(uid);
