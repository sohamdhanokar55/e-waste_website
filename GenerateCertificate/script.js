import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// 🔹 Firebase Config
const firebaseConfig = {
    apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
    authDomain: 'e-waste-86617.firebaseapp.com',
    projectId: 'e-waste-86617',
    storageBucket: 'e-waste-86617.firebasestorage.app',
    messagingSenderId: '558005114520',
    appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
    measurementId: 'G-EW6GZCDY30',
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 PDF.co API Key & Uploaded PDF URL
const apiKey = "chromaticnibbler@gmail.com_tYwMCvM37ghvEGoVOwYFh9fY3G4Vg0X7rsyVHaMCnWQGX6HdwBeS3LWZ8ApDJAAs";
const pdfUrl = "filetoken://b4ce6260cabd3ac9220cbee2c3ec023a13e333d97d4c544e40"; // Direct PDF link from PDF.co

// 🔹 Check Firebase Auth State BEFORE user clicks the button
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ Logged-in User Detected:", user.email); // Debugging

        document.getElementById("generateCertificate").addEventListener("click", async () => {
            try {
                const userEmail = user.email.trim().toLowerCase();  // Ensure proper matching
                console.log("🔎 Checking disposalRequests for:", userEmail); 

                // Query Firestore to check if the user's email exists in disposalRequests
                const q = query(collection(db, "disposalRequests"), where("email", "==", userEmail));
                const querySnapshot = await getDocs(q);

                let userData = null;
                querySnapshot.forEach((doc) => {
                    userData = doc.data();
                });

                if (!userData) {
                    console.warn("⚠ No matching disposal request found for:", userEmail);
                    alert("No disposal request data found for your account!");
                    return;
                }

                console.log("✅ User Data Retrieved:", userData);

                // Call the PDF.co function to generate the certificate
                generateCertificate(userData);
            } catch (error) {
                console.error("❌ Error fetching data:", error);
                alert("An error occurred while retrieving your data.");
            }
        });
    } else {
        console.error("❌ No user is logged in.");
        alert("User is not logged in! Please log in first.");
    }
});

async function generateCertificate(userData) {
    const requestBody = {
        url: pdfUrl,
        fields: [
            { fieldName: "CitizenName", pages: "0", text: userData.name },
            { fieldName: "Agency1", pages: "0", text: userData.agencyName },
            { fieldName: "Agency2", pages: "0", text: userData.agencyName },
            { fieldName: "Date", pages: "0", text: userData.disposalDate },
            { fieldName: "Type", pages: "0", text: userData.eWasteTypes },
            { fieldName: "AgencyEmail", pages: "0", text: userData.agencyEmail }
        ],
        outputType: "pdf"
    };

    const response = await fetch("https://api.pdf.co/v1/pdf/edit/add", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.error) {
        console.error("❌ Error generating PDF:", data.message);
        alert("Error generating certificate. Please try again.");
        return;
    }

    console.log("✅ Certificate Generated Successfully:", data.url);
    window.open(data.url, "_blank");
}
