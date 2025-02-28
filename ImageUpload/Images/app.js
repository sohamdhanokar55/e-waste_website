// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-storage.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

// ✅ Firebase Config (Replace with Your Own)
const firebaseConfig = {
  apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
  authDomain: 'e-waste-86617.firebaseapp.com',
  projectId: 'e-waste-86617',
  storageBucket: 'e-waste-86617.appspot.com', // 🔥 Fixed typo in storage bucket
  messagingSenderId: '558005114520',
  appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
  measurementId: 'G-EW6GZCDY30',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.uploadImage = async function () {
    const fileInput = document.getElementById("imageInput");
    if (fileInput.files.length === 0) {
        alert("Please select an image to upload.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Unsigned_upload");  // Replace with your actual upload preset

    try {
        // Upload to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/dwnorfkwt/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Upload Success:", data);

        // Display the uploaded image
        const uploadedImage = document.getElementById("uploadedImage");
        uploadedImage.src = data.secure_url;
        uploadedImage.style.display = "block";

        // Save the URL to Firebase
        await addDoc(collection(db, "images"), {
            imageUrl: data.secure_url,
            timestamp: new Date()
        });

        console.log("Image URL saved to Firebase");

    } catch (error) {
        console.error("Error:", error);
        alert("Error uploading image. Please try again.");
    }
};
