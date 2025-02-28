// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

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
const auth = getAuth();
const db = getFirestore();

// Show Message Function
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = 'block';
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign-Up Functionality
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', event => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;
  const contactNumber = document.getElementById('contact').value; // New Contact Field
  const district = document.getElementById('district').value;
  const agencyName = document.getElementById('aName').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      const userData = { 
        email, 
        firstName, 
        lastName, 
        contactNumber,
        district, 
        agencyName,
      };

      showMessage('Account Created Successfully', 'signUpMessage');
      return setDoc(doc(db, 'volunteerLogin', user.uid), userData);
    })
    .then(() => {
      document.getElementById('signup').style.display = 'none';
      document.getElementById('signIn').style.display = 'block';
      showMessage('Please Sign In to Continue', 'signInMessage');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create user', 'signUpMessage');
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
    const userQuery = query(collection(db, 'volunteerLogin'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      showMessage('Email not registered as a volunteer. Please sign up.', 'signInMessage');
      return;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const registeredVolunteer = querySnapshot.docs[0].data();

    if (registeredVolunteer.email !== user.email) {
      showMessage('Unauthorized login. Please use a volunteer account.', 'signInMessage');
      return;
    }

    showMessage('Login successful!', 'signInMessage');
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href = '../index.html';

  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showMessage('Incorrect password. Please try again.', 'signInMessage');
    } else if (error.code === 'auth/invalid-email') {
      showMessage('Invalid email format. Please enter a valid email.', 'signInMessage');
    } else {
      showMessage('Login failed. Please check your email and password.', 'signInMessage');
    }
  }
});




// Google Login Functionality
const googleSignInButton = document.getElementById('googleSignInButton');
googleSignInButton.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      const userData = {
        email: user.email,
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
        contactNumber: '', 
        email: '',
        AgencyName: '',
      };

      showMessage('Login with Google is successful', 'signInMessage');
      localStorage.setItem('loggedInUserId', user.uid);
      setDoc(doc(db, 'volunteerLogin', user.uid), userData, { merge: true })
        .then(() => {
          window.location.href = '../index.html';
        })
        .catch(error => {
          showMessage('Error saving user data', 'signInMessage');
        });
    })
    .catch(error => {
      showMessage('Google Login failed', 'signInMessage');
    });
});

// Password Toggle Visibility
document.querySelectorAll('.toggle-password').forEach(toggleIcon => {
  toggleIcon.addEventListener('click', function () {
    const passwordInput = this.previousElementSibling;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      passwordInput.type = 'password';
      this.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
}); 