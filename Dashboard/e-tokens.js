// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Config 
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
const auth = getAuth(app);
const db = getFirestore(app);

let userId = null;
let userName = null;

// DOM Elements
const eWalletBalance = document.getElementById("eWalletBalance");
const leaderboardDiv = document.getElementById("leaderboard");
const confirmBtn = document.getElementById("confirmBtn");
const modalPopup = document.getElementById("modalPopup");
const closeModalBtn = document.getElementById("closeModalBtn");
const progressBar = document.getElementById("progressBar");
const badgesContainer = document.getElementById("badgesContainer");
const redeemBtn = document.getElementById("redeemBtn");

// Milestone thresholds
const milestones = [
    { tokens: 2500, badge: "Bronze" },
    { tokens: 4000, badge: "Bronze" },
    { tokens: 6000, badge: "Silver" },
    { tokens: 8500, badge: "Silver" },
    { tokens: 10000, badge: "Silver" }
];

// Listen for user authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        console.log("Logged in user:", user);
        
        // Fetch user details from 'userLogin' collection
        const userRef = doc(db, "userLogin", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            userName = `${userSnap.data().firstName} ${userSnap.data().lastName}` || "Unknown";
        } else {
            userName = "Unknown";
        }

        await initializeUserEWallet(userId, userName);
        fetchUserEWallet(userId);
        subscribeToLeaderboard();
    } else {
        eWalletBalance.innerText = "Not Logged In";
    }
});

// Initialize user in eTokens collection
async function initializeUserEWallet(userId, userName) {
    const userRef = doc(db, "eTokens", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, { eTokens: 0, name: userName, maxETokens: 0 });
    } else if (!userSnap.data().name) {
        await updateDoc(userRef, { name: userName });
    }
}

// Fetch user E-Token balance
async function fetchUserEWallet(userId) {
    const userRef = doc(db, "eTokens", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        let currentTokens = userSnap.data().eTokens || 0;
        let maxETokens = userSnap.data().maxETokens || 0;
        
        eWalletBalance.innerText = `${currentTokens} E-Tokens`;
        updateProgressBar(maxETokens); // Ensure progress reflects maxETokens
    } else {
        eWalletBalance.innerText = "0 E-Tokens";
    }
}

// Update Progress Bar and Badges
function updateProgressBar(maxETokens) {
    const maxThreshold = 10000; // Max progress is at 10,000 E-Tokens
    const progress = Math.min((maxETokens / maxThreshold) * 100, 100);
    progressBar.style.width = `${progress}%`;

    // Update badges container (clear previous)
    badgesContainer.innerHTML = "";

    // Milestones and badge types with icons
    const milestoneBadges = [
        { tokens: 2500, badge: "bronze", icon: "fa-coins" },
        { tokens: 4000, badge: "bronze", icon: "fa-coins" },
        { tokens: 6000, badge: "silver", icon: "fa-medal" },
        { tokens: 8500, badge: "silver", icon: "fa-medal" },
        { tokens: 10000, badge: "gold", icon: "fa-trophy" }
    ];

    // Render badges based on milestone
    milestoneBadges.forEach(milestone => {
        const badgeDiv = document.createElement("div");
        badgeDiv.classList.add("badge");

        // Set badge color and icon if the user reaches the milestone
        if (maxETokens >= milestone.tokens) {
            badgeDiv.classList.add(milestone.badge);
            badgeDiv.innerHTML = `<i class="fa ${milestone.icon}"></i>`;
        } else {
            badgeDiv.innerHTML = `<i class="fa fa-lock"></i>`;
        }

        badgesContainer.appendChild(badgeDiv);
    });
}

// Subscribe to real-time leaderboard updates
function subscribeToLeaderboard() {
    const leaderboardQuery = query(collection(db, "eTokens"), orderBy("eTokens", "desc"));

    onSnapshot(leaderboardQuery, (querySnapshot) => {
        leaderboardDiv.innerHTML = "";
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const listItem = document.createElement("div");
            listItem.classList = "flex justify-between p-2 border-b";
            listItem.innerHTML = `<span>${rank}. ${userData.name || "Unknown"}</span>
                                  <span>${userData.eTokens || 0} E-Tokens</span>`;
            leaderboardDiv.appendChild(listItem);
            rank++;
        });
    });
}

// Confirm E-Tokens earning
confirmBtn.addEventListener("click", async () => {
    if (!userId) return;
    
    const userRef = doc(db, "eTokens", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        let currentTokens = userSnap.data().eTokens || 0;
        let maxETokens = userSnap.data().maxETokens || 0;

        // Increase balance by 400 E-Tokens
        let newTokens = currentTokens + 400;
        let newMaxTokens = Math.max(newTokens, maxETokens);

        await updateDoc(userRef, { eTokens: newTokens, maxETokens: newMaxTokens });

        eWalletBalance.innerText = `${newTokens} E-Tokens`;
        updateProgressBar(newMaxTokens); // Ensure progress reflects maxETokens
    }

    // Show Confirmation Popup for earning E-Tokens
    modalPopup.classList.remove("hidden");
    setTimeout(() => modalPopup.classList.add("hidden"), 1500);
});

// Redeem E-Tokens
redeemBtn.addEventListener("click", async () => {
    if (!userId) return;

    const userRef = doc(db, "eTokens", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        let currentTokens = userSnap.data().eTokens || 0;
        let maxETokens = userSnap.data().maxETokens || 0;

        if (currentTokens >= 500) {
            let newTokens = currentTokens - 500;

            await updateDoc(userRef, { eTokens: newTokens });

            eWalletBalance.innerText = `${newTokens} E-Tokens`;
            updateProgressBar(maxETokens); // Keep progress at maxETokens
            alert("✅ Successfully redeemed 500 E-Tokens!");
        } else {
            alert("❌ Not enough E-Tokens to redeem!");
        }
    }
});
