import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve product data from session storage
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

    if (!productData) {
        console.error("No product data found in session storage.");
        return;
    }

    // Update title
    document.querySelector(".title").textContent = productData.title;

    // Update images
    const imageContainers = document.querySelectorAll(".img-container img");
    productData.images.forEach((imageUrl, index) => {
        if (imageContainers[index]) {
            imageContainers[index].src = imageUrl;
        }
    });

    // Update price
    document.querySelector(".price").textContent = `₹${productData.price}`;

    // Update district
    document.querySelector(".category b i.fa-map-marker-alt").parentElement.innerHTML =
        `<b><i class="fas fa-map-marker-alt"></i> District:</b> ${productData.district}`;

    // Update WhatsApp number
    document.querySelector(".category b i.fab.fa-whatsapp").parentElement.innerHTML =
        `<b><i class="fab fa-whatsapp"></i> WhatsApp Number:</b> ${productData.phone}`;

    // Update description
    document.querySelector(".main-details p:nth-child(2)").textContent = productData.description;
});

document.addEventListener("DOMContentLoaded", () => {
    const sellerButton = document.querySelector(".seller-button");

    if (sellerButton) {
        sellerButton.addEventListener("click", async () => {
            alert("Congratulations! The order has been placed. The seller will contact you.");

            // Check if a user is logged in
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    try {
                        // Get user details from userLogin collection
                        const userRef = doc(db, "userLogin", user.uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

                            if (!productData) {
                                console.error("No product data found in session storage.");
                                return;
                            }

                            // Retrieve seller's userId from ewaste_listings by matching the title
                            const listingsRef = collection(db, "ewaste_listings");
                            const q = query(listingsRef, where("title", "==", productData.title));
                            const querySnapshot = await getDocs(q);

                            let sellerId = "";
                            querySnapshot.forEach((doc) => {
                                sellerId = doc.data().userId || "";
                            });

                            if (!sellerId) {
                                console.warn(`No matching listing found for title: ${productData.title}`);
                            }

                            // Store user details along with product request
                            const requestData = {
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                contact: userData.contactNumber,
                                email: userData.email,
                                district: userData.district,
                                productTitle: productData.title,
                                sellerId: sellerId, // Store seller's userId
                                timestamp: new Date()
                            };

                            await addDoc(collection(db, "productRequest"), requestData);
                            console.log("Product request stored successfully with sellerId:", sellerId);
                        } else {
                            console.error("User details not found in userLogin collection.");
                        }
                    } catch (error) {
                        console.error("Error retrieving user details or storing product request:", error);
                    }
                } else {
                    alert("Please log in to place an order.");
                }
            });
        });
    }
});
