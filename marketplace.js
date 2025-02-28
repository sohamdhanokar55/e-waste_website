import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs,addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: 'AIzaSyAPOAnjEonfSA85fOgj8p2ADHGJZ1aJbKA',
    authDomain: 'e-waste-86617.firebaseapp.com',
    projectId: 'e-waste-86617',
    storageBucket: 'e-waste-86617.firebasestorage.app',
    messagingSenderId: '558005114520',
    appId: '1:558005114520:web:a8b5fb2bc1cc22340fa2ed',
    measurementId: 'G-EW6GZCDY30',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.querySelector(".product-grid");
    const districtSelect = document.querySelector(".marketplace-head select:nth-child(1)");
    const categorySelect = document.querySelector(".marketplace-head select:nth-child(2)");
    const sellButton = document.querySelector(".sell-button");

    let selectedCategory = null;
    let selectedDistrict = null;
    let allProducts = [];

    async function fetchProducts() {
        productGrid.innerHTML = "<p>Loading products...</p>";
        const querySnapshot = await getDocs(collection(db, "ewaste_listings"));
        allProducts = querySnapshot.docs.map(doc => doc.data());
        displayFilteredProducts();
    }

    async function storeSelectedProduct(product) {
        try {
            const selectedProduct = {
                district: product.district,
                phone: product.phone,
                userId: product.userId,
                images: product.images.slice(0, 5), // Ensure only 5 images
                title: product.title,
                price: product.price
            };
    
            await addDoc(collection(db, "selected_products"), selectedProduct);
            sessionStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
    
            console.log("Session Storage:", sessionStorage.getItem("selectedProduct"));
            alert("Product added to your selected list!");
        } catch (error) {
            console.error("Error adding selected product: ", error);
            alert("Failed to store product selection.");
        }
    }

    function displayFilteredProducts() {
        productGrid.innerHTML = "";
        let filteredProducts = allProducts.filter(product => {
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesDistrict = selectedDistrict ? product.district === selectedDistrict : true;
            return matchesCategory && matchesDistrict;
        });

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = "<p>No products found matching your selection.</p>";
            return;
        }

        filteredProducts.forEach(createProductCard);
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add("card");
    
        const image = document.createElement("img");
        image.src = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "Images/article1.jpg";
        image.alt = product.title;
        image.classList.add("product-image");
    
        const title = document.createElement("h3");
        title.classList.add("product-title");
        title.textContent = product.title;
    
        const footer = document.createElement("div");
        footer.classList.add("card-footer");
    
        const price = document.createElement("p");
        price.classList.add("product-price");
        price.innerHTML = `₹<span>${product.price}</span>`;
    
        const buyButton = document.createElement("button");
        buyButton.classList.add("buy-btn");
        buyButton.textContent = "Buy Now";
    
        // Store product data in sessionStorage when Buy button is clicked
        buyButton.addEventListener("click", () => {
            storeSelectedProduct(product);
            window.location.href = "product-listing.html";
        });
    
        footer.appendChild(price);
        footer.appendChild(buyButton);
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(footer);
        productGrid.appendChild(card);
    }
    
    // Function to store selected product in sessionStorage
    function storeSelectedProduct(product) {
        sessionStorage.setItem("selectedProduct", JSON.stringify(product));
        console.log("Session Storage:", sessionStorage.getItem("selectedProduct"));
    }
    
    districtSelect.addEventListener("change", () => {
        selectedDistrict = districtSelect.value === "All districts" ? null : districtSelect.value;
        displayFilteredProducts();
    });

    categorySelect.addEventListener("change", () => {
        selectedCategory = categorySelect.value === "All Categories" ? null : categorySelect.value;
        displayFilteredProducts();
    });

    sellButton.addEventListener("click", () => {
        window.location.href = "selling-form.html";
    });


    fetchProducts();
}); 



