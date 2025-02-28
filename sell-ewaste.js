import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
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

document.getElementById("ewasteForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("User not logged in!");
        return;
    }
    
    const userId = user.uid;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const district = document.getElementById("district").value;
    
    let imageUrls = [];
    const imageInputs = document.querySelectorAll("input[type='file']");
    for (let i = 0; i < imageInputs.length; i++) {
        if (imageInputs[i].files.length > 0) {
            const file = imageInputs[i].files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "Unsigned_upload");

            try {
                const response = await fetch("https://api.cloudinary.com/v1_1/dwnorfkwt/image/upload", {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                imageUrls.push(data.secure_url);
            } catch (error) {
                console.error("Error uploading image: ", error);
                alert("Failed to upload image.");
                return;
            }
        }
    }
    
    try {
        await addDoc(collection(db, "ewaste_listings"), {
            userId,
            district,
            title,
            category,
            description,
            price,
            address,
            phone,
            images: imageUrls,
            timestamp: new Date()
        });
        alert("Listing submitted successfully!");
        document.getElementById("ewasteForm").reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to submit listing.");
    }
});
