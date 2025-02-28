import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';

import { getFirestore, doc, setDoc,  query, where, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
  authDomain: 'e-waste-86617.firebaseapp.com',
  projectId: 'e-waste-86617',
  storageBucket: 'e-waste-86617.firebasestorage.app',
  messagingSenderId: '558005114520',
  appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = 'block';
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// ✅ Sign Up Logic
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', event => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const agencyName = document.getElementById('aName').value;
  const stateName = document.getElementById('state').value;
  const contact = document.getElementById('contact').value;
  const cityName = document.getElementById('city').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      const agencyData = {
        email: email,
        agencyName: agencyName,
        stateName: stateName,
        contact: contact,
        cityName: cityName,
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, 'agencyLogin', user.uid);
      setDoc(docRef, agencyData)
        .then(() => {
          showMessage('Redirecting...', 'signUpMessage');
          setTimeout(() => {
            window.location.href = "../index.html"; // ✅ Redirect after successful signup
          }, 2000);
        })
        .catch(error => {
          console.error('Error writing document', error);
        });
    })
    .catch(error => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create account, try again later.', 'signUpMessage');
      }
    });
});


// Sign-In Functionality
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', async event => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Check if email exists in Firestore before authenticating
    const userQuery = query(collection(db, 'agencyLogin'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      showMessage('Email not registered. Please sign up first.', 'signInMessage');
      return; // Stop further execution if email does not exist
    }

    // Proceed with Firebase authentication
    await signInWithEmailAndPassword(auth, email, password);
    showMessage('Login is successful', 'signInMessage');
    localStorage.setItem('loggedInUserId', auth.currentUser.uid);
    window.location.href = '../index.html';

  } catch (error) {
    if (error.code === 'auth/invalid-credential') {
      showMessage('Incorrect password. Please try again.', 'signInMessage');
    } else if (error.code === 'auth/invalid-email') {
      showMessage('Invalid email format. Please enter a valid email.', 'signInMessage');
    } else {
      showMessage('Login failed. Please check your email and password.', 'signInMessage');
    }
  }
});

// ✅ Google Login
const googleLoginBtn = document.getElementById('google-login-btn');
googleLoginBtn.addEventListener('click', event => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      showMessage('Google Sign In Success!', 'signInMessage');
      setTimeout(() => {
        window.location.href = "../index.html"; // ✅ Redirect after Google login
      }, 1000);
    })
    .catch(error => {
      showMessage('Google Sign In Failed!', 'signInMessage');
    });
});

// ✅ Switch between Sign Up and Sign In
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');

signUpButton.addEventListener('click', () => {
  document.getElementById('signIn').style.display = 'none';
  document.getElementById('signup').style.display = 'block';
});

signInButton.addEventListener('click', () => {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('signIn').style.display = 'block';
});
