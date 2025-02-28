import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA",
    authDomain: "e-waste-86617.firebaseapp.com",
    projectId: "e-waste-86617",
    storageBucket: "e-waste-86617.appspot.com",
    messagingSenderId: "558005114520",
    appId: "1:558005114520:web:a8b5fb2bc1cc22340fa2ed",
    measurementId: "G-EW6GZCDY30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Cloudinary Configuration
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
        console.error("❌ Error uploading to Cloudinary:", error);
        return null;
    }
};

// Function to update user's document in Firestore
const updateUserProfilePic = async (email, imageUrl) => {
    try {
        const userQuery = query(collection(db, "userLogin"), where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.warn("⚠️ No user found in userLogin collection.");
            return;
        }

        const userDoc = userSnapshot.docs[0].ref;
        await updateDoc(userDoc, { profilePic: imageUrl });

        console.log("✅ Profile picture updated successfully.");
    } catch (error) {
        console.error("❌ Error updating Firestore:", error);
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
        const userQuery = query(collection(db, "userLogin"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData.profilePic) {
                profilePic.src = userData.profilePic; // Load existing profile picture
            }
        }
    }
});
