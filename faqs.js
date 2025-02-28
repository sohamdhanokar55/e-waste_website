// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Form submission event listener
document.querySelector(".submit-btn").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const firstName = document.getElementById("FName").value.trim();
    const lastName = document.getElementById("lName").value.trim();
    const email = document.querySelector(".email-input input").value.trim();
    const question = document.querySelector(".question-input input").value.trim();

    if (firstName === "" || lastName === "" || email === "" || question === "") {
        alert("Please fill in all fields before submitting.");
        return;
    }

    try {
        await addDoc(collection(db, "faqs"), {
            name: `${firstName} ${lastName}`,
            email: email,
            question: question,
            timestamp: new Date()
        });
        alert("Your question has been submitted successfully!");

        // Clear input fields after submission
        document.getElementById("FName").value = "";
        document.getElementById("lName").value = "";
        document.querySelector(".email-input input").value = "";
        document.querySelector(".question-input input").value = "";
    } catch (error) {
        console.error("Error submitting question: ", error);
        alert("An error occurred. Please try again later.");
    }
});


const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

