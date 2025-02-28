import { getFirestore, collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { getApps, getApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';

const app = getApps().length ? getApp() : null;
const auth = getAuth();

if (!app) {
    console.error("Firebase app is not initialized! Make sure profile-script.js runs first.");
} else {
    console.log("Using existing Firebase app instance from profile-script.js");
}

const db = app ? getFirestore(app) : null;
let uploadedImages = new Array(5).fill(null);
let isEdited = false;

window.uploadImage = async function (input) {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }

    if (!input.files || input.files.length === 0) {
        alert("Please select an image to upload.");
        return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Unsigned_upload");

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dwnorfkwt/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (!data.secure_url) throw new Error("Invalid response from Cloudinary");

        const imgContainer = input.closest('.img-container');
        const uploadedImage = imgContainer.querySelector('.uploaded-image');
        const uploadLabel = imgContainer.querySelector('.upload-container');

        if (uploadedImage && uploadLabel) {
            uploadedImage.src = data.secure_url;
            uploadedImage.style.display = "block";
            uploadLabel.style.display = "none";
        }

        const editButton = imgContainer.querySelector('.edit-button');
        if (editButton) {
            editButton.style.display = "block";
        }

        const imgIndex = [...document.querySelectorAll('.img-container')].indexOf(imgContainer);
        uploadedImages[imgIndex] = data.secure_url;

        console.log(`Image uploaded and stored at index ${imgIndex}: ${data.secure_url}`);

        isEdited = true;
        updateSaveButtonState();

    } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
    }
};

window.editImage = function (button) {
    const imgContainer = button.closest('.img-container');
    const uploadLabel = imgContainer.querySelector('.upload-container');
    const uploadedImage = imgContainer.querySelector('.uploaded-image');

    uploadLabel.style.display = "flex";  
    uploadedImage.style.display = "none"; 
    button.style.display = "none"; 

    function handleClickOutside(event) {
        if (!imgContainer.contains(event.target)) {
            uploadLabel.style.display = "none"; 
            uploadedImage.style.display = "block"; 
            button.style.display = "block"; 
            document.removeEventListener("click", handleClickOutside);
        }
    }

    document.addEventListener("click", handleClickOutside);
};

document.getElementById("saveImages").addEventListener("click", async () => {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }

    if (uploadedImages.includes(null)) {
        alert("Please upload images to all 5 containers before saving.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        console.error("No user is currently logged in.");
        alert("Please log in first.");
        return;
    }

    try {
        await setDoc(doc(db, "agencyLogin", user.uid), { images: uploadedImages }, { merge: true });

        console.log("All images successfully saved to Firebase!");
        alert("Images saved successfully.");

        isEdited = false;
        updateSaveButtonState();
    } catch (error) {
        console.error("Error saving images:", error);
        alert("Error saving images. Please try again.");
    }
});

async function loadSavedImages() {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        console.error("No user is currently logged in.");
        return;
    }

    try {
        const docSnap = await getDoc(doc(db, "agencyLogin", user.uid));
        if (docSnap.exists()) {
            const savedImages = docSnap.data().images;

            document.querySelectorAll('.img-container').forEach((container, index) => {
                if (savedImages[index]) {
                    const uploadedImage = container.querySelector('.uploaded-image');
                    const uploadLabel = container.querySelector('.upload-container');

                    uploadedImage.src = savedImages[index];
                    uploadedImage.style.display = "block";
                    uploadLabel.style.display = "none";

                    uploadedImages[index] = savedImages[index];

                    const editButton = container.querySelector('.edit-button');
                    if (editButton) {
                        editButton.style.display = "block";
                    }
                }
            });

            console.log("Saved images loaded from Firebase:", savedImages);
        } else {
            console.log("No saved images found for this user.");
        }
    } catch (error) {
        console.error("Error loading saved images:", error);
    }

    updateSaveButtonState();
}

function updateSaveButtonState() {
    const saveButton = document.getElementById("saveImages");
    saveButton.disabled = !isEdited;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        loadSavedImages();
    } else {
        console.log("No user is logged in.");
    }
});
