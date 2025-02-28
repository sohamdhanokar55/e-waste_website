import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const auth = getAuth();

// References
const container = document.querySelector(".container");
const modal = document.getElementById("redeemModal");
const cancelModalBtn = document.getElementById("cancelModal");
const confirmRedeemBtn = document.getElementById("confirmRedeem");
const redeemDateInput = document.getElementById("redeemDate");
const redeemTimeInput = document.getElementById("redeemTime");

let selectedStore = null;
let currentUser = null;

// Fetch Logged-In User Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userSnapshot = await getDocs(collection(db, "userLogin"));
        userSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.email === user.email) {
                currentUser = { uid: user.uid, ...userData };
                console.log("User found:", currentUser);
            }
        });

        if (!currentUser) {
            console.error("No matching user found in userLogin.");
        } else {
            fetchEStores();
        }
    } else {
        console.error("No authenticated user.");
    }
});

// Fetch & Display E-Stores
const fetchEStores = () => {
    onSnapshot(collection(db, "estoreLogin"), (snapshot) => {
        container.innerHTML = "";
        snapshot.forEach((doc) => {
            const storeData = doc.data();
            const storeElement = document.createElement("div");
            storeElement.classList.add("current-order");

            storeElement.innerHTML = `
                <div class="profile-image">
                    <img src="Images/profilepic.jpg" alt="Profile Picture">
                </div>
                <div class="description">
                    <p>Store: <b>${storeData.storeName}</b></p>
                    <p>City: <b>${storeData.cityName}</b></p>
                    <p>Email: <b>${storeData.email}</b></p>
                    <p>Contact: <b>${storeData.contact}</b></p>
                    <p>Address: <b>${storeData.stateName || "Not provided"}</b></p>
                </div>
                <div class="buttons">
                    <button class="btn btn-success redeem-button">Redeem</button>
                </div>
            `;

            container.appendChild(storeElement);

            // Handle Redeem Button Click
            storeElement.querySelector(".redeem-button").addEventListener("click", () => {
                selectedStore = storeData;
                openModal();
            });
        });
    });
};

// Open Modal
const openModal = () => {
    modal.classList.remove("hidden");
};

// Close Modal (Fix for Cancel button)
cancelModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Confirm Redemption (Fix)
confirmRedeemBtn.addEventListener("click", async () => {
    if (!selectedStore || !currentUser) {
        alert("Error: Store or user details missing.");
        console.error("currentUser:", currentUser);
        console.error("selectedStore:", selectedStore);
        return;
    }

    const redemptionDate = redeemDateInput.value;
    const redemptionTime = redeemTimeInput.value;
    const productNameInput = document.getElementById("productName");
    const productDescriptionInput = document.getElementById("productDescription");

    if (!productNameInput || !productDescriptionInput) {
        alert("Product fields are missing in the modal.");
        console.error("Product Name or Description input is missing.");
        return;
    }

    const productName = productNameInput.value.trim();
    const productDescription = productDescriptionInput.value.trim();

    if (!redemptionDate || !redemptionTime || !productName || !productDescription) {
        alert("Please fill all fields.");
        return;
    }

    const redeemData = {
        userId: currentUser.uid || "Unknown",
        userName: currentUser.name || "Unknown",
        userEmail: currentUser.email || "Unknown",
        storeName: selectedStore.storeName,
        cityName: selectedStore.cityName,
        email: selectedStore.email,
        contact: selectedStore.contact,
        stateName: selectedStore.stateName,
        redemptionDate,
        redemptionTime,
        productName,
        productDescription,
        timestamp: new Date(),
    };

    try {
        await addDoc(collection(db, "etokenredeem"), redeemData);
        modal.classList.add("hidden");
        alert("Redemption request placed successfully!");

        // Change Redeem button to Check Status
        const redeemButton = selectedStore.redeemButton;
        if (redeemButton) {
            redeemButton.textContent = "Check Status";
            redeemButton.classList.remove("btn-success");
            redeemButton.classList.add("btn-primary");
        }
    } catch (error) {
        console.error("Error adding document:", error);
    }
});
