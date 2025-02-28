import { auth, db } from "./firebase-config.js";  // ✅ Import auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot,arrayUnion,doc, updateDoc, where, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { uploadImage } from "./cloudinary.js";
console.log("Upload Image function:", uploadImage);

let currentUser = null;

const feed = document.getElementById("feed");

// Select UI Elements
const groupList = document.getElementById("groupList");
const createGroupBtn = document.getElementById("createGroupBtn");
const groupNameInput = document.getElementById("groupNameInput");
const submitPost = document.getElementById("submitPost");
const postWarning = document.getElementById("postWarning");

let userEmail = null;
let currentUserEmail = null;
let currentGroup = null;
let selectedGroupId = null; 


// Fetch the Logged-in User from Firebase Auth
onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmail = user.email;
        console.log("Logged-in user:", userEmail);
        fetchGroups(); // Fetch groups after getting user info
    } else {
        console.error("User not logged in!");
    }
});


// Function to Create a Group
async function createGroup() {
    const groupName = groupNameInput.value.trim();
    if (!groupName) return alert("Enter a valid group name!");
    if (!userEmail) return alert("User data not found!");

    try {
        await addDoc(collection(db, "groups"), {
            name: groupName,
            members: [userEmail], // The creator is automatically a member
            admin: userEmail, // ✅ Set the creator as the admin
            timestamp: Date.now()
        });

        console.log("Group Created:", groupName);
        groupNameInput.value = "";
    } catch (error) {
        console.error("Error creating group:", error);
    }
}



// Function to Fetch & Display Groups
function fetchGroups() {
    const groupsQuery = query(collection(db, "groups"), orderBy("timestamp", "desc"));

    onSnapshot(groupsQuery, (snapshot) => {
        groupList.innerHTML = ""; // Clear previous groups

        snapshot.forEach(docSnapshot => {
            const { name, members, admin } = docSnapshot.data();
            const groupId = docSnapshot.id;
            console.log("group id: " + groupId);

            const groupItem = document.createElement("li");
            groupItem.classList.add("cursor-pointer", "p-2", "bg-gray-200", "rounded-lg", "hover:bg-gray-300", "flex", "justify-between", "items-center");
            groupItem.textContent = name;

            const isMember = members.includes(userEmail);
            if (isMember) {
                groupItem.classList.add("bg-green-900"); // Highlight joined groups
            }

            groupItem.addEventListener("click", async () => {
                if (!isMember) {
                    const join = confirm(`You are not a member of ${name}. Join this group?`);
                    if (join) {
                        await joinGroup(groupId);
                    }
                    return;
                }

                selectedGroupId = groupId;
                currentGroup = name;
                enablePosting();
                fetchPosts();
            });

                // ✅ Show delete button only if the current user is the admin
                console.log(`Group: ${name} | Admin: ${admin} | Current User: ${userEmail}`);
                if (admin === userEmail) { 
                const deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "🗑️"; // Bin icon
                deleteBtn.classList.add("ml-4", "text-red-500", "hover:text-red-700");

                deleteBtn.addEventListener("click", async (event) => {
                    event.stopPropagation(); // Prevent group selection when clicking delete
                    if (confirm(`Are you sure you want to delete the group "${name}"?`)) {
                        await deleteGroup(groupId);
                    }
                });

                groupItem.appendChild(deleteBtn);
            }

            groupList.appendChild(groupItem);
        });

        console.log("Groups Loaded");
    });
}


// Function to Join a Group
async function joinGroup(groupId) {
    if (!userEmail) return alert("User data not found!");

    const groupRef = doc(db, "groups", groupId);

    try {
        await updateDoc(groupRef, {
            members: arrayUnion(userEmail)
        });
        console.log("Joined group successfully!");
        enablePosting();
    } catch (error) {
        console.error("Error joining group:", error);
    }
}

// Function to Enable Posting
function enablePosting() {
    if (selectedGroupId) {
        submitPost.disabled = false;
        submitPost.classList.remove("bg-gray-400");
        submitPost.classList.add("bg-green-900");
        postWarning.classList.add("hidden");
    }
}

function disablePosting() {
    submitPost.disabled = true;
    submitPost.classList.remove("bg-blue-500");
    submitPost.classList.add("bg-gray-400");
    postWarning.classList.remove("hidden");
}


// Delete a Group
async function deleteGroup(groupId) {
    try {
        await deleteDoc(doc(db, "groups", groupId));
        console.log("Group deleted successfully!");
    } catch (error) {
        console.error("Error deleting group:", error);
    }
}


// ✅ Function to join a group or switch between groups
async function joinOrSwitchGroup(groupId) {
    if (!userEmail) {
        console.error("User not logged in.");
        return;
    }

    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
        let groupData = groupSnap.data();
        let members = groupData.members || [];

        if (!members.includes(userEmail)) {
            // ✅ First-time click → Join the group
            await updateDoc(groupRef, {
                members: arrayUnion(userEmail)
            });
            alert(`You have joined the group.`);
        }

        // ✅ After joining, update selectedGroupId and fetch posts
        selectedGroupId = groupId;
        fetchPosts(selectedGroupId);
    } else {
        console.error("Group not found!");
    }
}


// ✅ Fetch posts only for the currently selected group
function fetchPosts() {
    if (!currentGroup) {
        console.warn("No group selected. Posts cannot be loaded.");
        return;
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("groupName", "==", currentGroup),  // ✅ Match posts with groupName
        orderBy("timestamp", "desc")
    );

    onSnapshot(postsQuery, (snapshot) => {
        feed.innerHTML = ""; // Clear previous posts

        if (snapshot.empty) {
            console.log("No posts found for this group.");
            feed.innerHTML = `<p class='text-gray-600'>No posts in this group yet. Start a conversation!</p>`;
        } else {
            snapshot.forEach(doc => {
                const { userName, content, imageUrl } = doc.data();

                const postDiv = document.createElement("div");
                postDiv.classList.add("p-4", "bg-white", "rounded-lg", "shadow-md");

                postDiv.innerHTML = `
                    <p class="font-bold text-lg text-blue-600">${userName}</p>
                    <p class="text-gray-700">${content}</p>
                    ${imageUrl ? `<img src="${imageUrl}" class="mt-2 rounded-lg w-full max-h-64 object-cover">` : ""}
                `;

                feed.appendChild(postDiv);
            });
        }
    });
}


// Event Listeners
createGroupBtn.addEventListener("click", createGroup);
disablePosting(); // Disable posting initially

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userEmail = user.email;  // ✅ Assign userEmail
        console.log("Logged-in user:", userEmail);

        const userRef = query(collection(db, "userLogin"));
        const snapshot = await getDocs(userRef);
        snapshot.forEach(doc => {
            if (doc.data().email === user.email) {
                currentUser = doc.data();
            }
        });

        console.log("Before fetching posts, userEmail =", userEmail);
        fetchPosts();  // ✅ Now it's called after userEmail is set
    } else {
        console.error("User not logged in!");
        userEmail = null;
    }
});

   
document.addEventListener("DOMContentLoaded", fetchPosts);

// ✅ Function to Display Messages in Chat Box
function displayMessage(userName, message) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("p-2", "border", "rounded-lg", "mb-2", "bg-gray-200");
    messageDiv.innerHTML = `<strong>${userName}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);

    // ✅ Auto-scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Real-time listener to fetch messages
const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
onSnapshot(messagesQuery, (snapshot) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = ""; // Clear chat box before updating

    snapshot.forEach(doc => {
        const { userName, message } = doc.data();
        displayMessage(userName, message);
    });
});



// Posting to the community feed
document.getElementById("submitPost").addEventListener("click", async () => {
    const postContent = document.getElementById("postContent").value;
    const postImage = document.getElementById("postImage").files[0];

    if (!selectedGroupId || !currentGroup) {
        alert("Please select a group before posting.");
        return;
    }

    if (!postContent.trim()) {
        alert("Post content cannot be empty!");
        return;
    }

    let imageUrl = "";
    if (postImage) {
        try {
            imageUrl = await uploadImage(postImage);
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    }

    try {
        await addDoc(collection(db, "posts"), {
            userName: currentUser.firstName + " " + currentUser.lastName,
            content: postContent,
            imageUrl: imageUrl || null,
            groupName: currentGroup,
            timestamp: serverTimestamp(),
        });

        console.log("Post successfully added!");
        document.getElementById("postContent").value = "";
        document.getElementById("postImage").value = "";
    } catch (error) {
        console.error("Error posting:", error);
    }
});


// Sending chat messages
document.getElementById("sendChat").addEventListener("click", async () => {
    if (!currentUser) {
        console.error("User not authenticated. Cannot send message.");
        alert("You must be logged in to send messages.");
        return;
    }

    const chatInput = document.getElementById("chatInput").value;
    if (chatInput.trim() === "") return;

    try {
        await addDoc(collection(db, "messages"), {
            userId: currentUser.email,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            message: chatInput,
            timestamp: serverTimestamp()
        });

        console.log("Message sent:", chatInput);
        document.getElementById("chatInput").value = "";
    } catch (error) {
        console.error("Error sending message:", error);
    }
});


