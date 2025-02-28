import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, deleteDoc, query, where, getDocs, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Reference to the container
const container = document.querySelector(".container");

// Function to delete from ewaste_listings if sellerId matches userId
const deleteFromEwasteListings = async (productTitle, sellerId) => {
    try {
        const listingQuery = query(
            collection(db, "ewaste_listings"),
            where("title", "==", productTitle),
            where("userId", "==", sellerId) // Ensures correct match
        );

        const listingSnapshot = await getDocs(listingQuery);

        if (listingSnapshot.empty) {
            console.warn(`No matching ewaste_listings found for "${productTitle}" with sellerId "${sellerId}".`);
            return;
        }

        for (const docRef of listingSnapshot.docs) {
            await deleteDoc(docRef.ref);
            console.log(`✅ Deleted "${productTitle}" from ewaste_listings (SellerId matched).`);
        }
    } catch (error) {
        console.error(`❌ Error deleting from ewaste_listings:`, error);
    }
};

// Function to delete product from productRequest and then ewaste_listings
const deleteProduct = async (productTitle, timestamp) => {
    try {
        const requestQuery = query(
            collection(db, "productRequest"),
            where("productTitle", "==", productTitle),
            where("timestamp", "==", timestamp)
        );

        const requestSnapshot = await getDocs(requestQuery);

        if (requestSnapshot.empty) {
            console.warn(`⚠️ No matching productRequest found for "${productTitle}".`);
            return;
        }

        for (const docRef of requestSnapshot.docs) {
            const sellerId = docRef.data().sellerId;

            if (!sellerId) {
                console.warn(`⚠️ No sellerId found for "${productTitle}".`);
                continue;
            }

            await deleteDoc(docRef.ref);
            console.log(`✅ Deleted "${productTitle}" from productRequest.`);

            // Now delete from ewaste_listings
            await deleteFromEwasteListings(productTitle, sellerId);
        }
    } catch (error) {
        console.error(`❌ Error deleting from productRequest:`, error);
    }
};

// Function to render product requests
const renderRequests = (requests) => {
    container.innerHTML = ""; // Clear existing requests before updating

    requests.forEach((request) => {
        const { productTitle, firstName, lastName, email, contact, district, timestamp } = request;

        // Create a new request element
        const requestElement = document.createElement("div");
        requestElement.classList.add("current-order");

        requestElement.innerHTML = `
            <div class="profile-image">
                <img src="Images/profilepic.jpg" alt="Profile Picture">
            </div>
            <div class="description">
                <p>Product-Name: <b>${productTitle}</b></p>
                <p>Name: <b>${firstName} ${lastName}</b></p>
                <p>Email: <b>${email}</b></p>
                <p>Contact: <b>${contact}</b></p>
                <p>Address: <b>${district || "Not provided"}</b></p>
            </div>
            <div class="buttons">
                <button class="btn btn-success confirm-button">Confirm</button>
                <button class="btn btn-error deny-button">Deny</button>
            </div>
        `;

        // Append the request to the container
        container.appendChild(requestElement);

        // Attach event listener to Confirm button
        requestElement.querySelector(".confirm-button").addEventListener("click", async () => {
            if (confirm(`Are you sure you want to confirm this request for "${productTitle}"?`)) {
                await deleteProduct(productTitle, timestamp);
            }
        });
    });
};

// Listen for real-time updates
onSnapshot(collection(db, "productRequest"), (snapshot) => {
    const requests = snapshot.docs.map(doc => doc.data());
    renderRequests(requests);
});
