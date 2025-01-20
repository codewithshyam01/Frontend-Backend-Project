// State management
let currentPage = 'home';
let cart = [];
let searchHistory = [];
let currentUser = null;

// DOM Elements
const app = document.getElementById('app');

// Router
function navigate(page) {
    currentPage = page;
    renderApp();
}

// Render Functions
function renderApp() {
    switch(currentPage) {
        case 'home':
            renderHome();
            break;
        case 'search':
            renderSearch();
            break;
        case 'cart':
            renderCart();
            break;
        case 'profile':
            renderProfile();
            break;
        default:
            renderHome();
    }
}

function renderHome() {
    app.innerHTML = `
        <div class="container mx-auto px-4">
            <!-- Header -->
            <header class="flex justify-between items-center py-4">
                <h1 class="text-3xl font-bold">Home</h1>
                <div class="relative">
                    <button class="p-2">
                        <i class="fas fa-bell text-xl"></i>
                        <span class="absolute top-0 right-0 bg-green-500 w-2 h-2 rounded-full"></span>
                    </button>
                </div>
            </header>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative">
                    <input type="text" 
                           placeholder="Search" 
                           class="w-full p-4 rounded-lg bg-gray-200 focus:outline-none"
                           onclick="navigate('search')">
                    <span class="absolute right-4 top-4">
                        <i class="fas fa-search text-gray-400"></i>
                    </span>
                </div>
            </div>

            <!-- Banner -->
            <div class="bg-green-500 rounded-lg p-8 mb-6 text-white relative overflow-hidden">
                <div class="relative z-10">
                    <h2 class="text-4xl font-bold mb-2">New Product</h2>
                    <button class="bg-white text-green-500 px-8 py-2 rounded-full font-semibold">
                        Buy
                    </button>
                </div>
                <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753617559" 
                     class="absolute right-0 top-0 h-full object-contain transform translate-x-1/4" 
                     alt="New Product">
            </div>

            <!-- Categories -->
            <div class="flex gap-4 mb-6 overflow-x-auto py-2">
                ${categories.map(category => `
                    <button class="px-6 py-2 rounded-full ${category === 'All' ? 'bg-green-500 text-white' : 'bg-white'} 
                            whitespace-nowrap shadow-sm">
                        ${category}
                    </button>
                `).join('')}
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 gap-4 mb-20">
                ${products.map(product => `
                    <div class="bg-white p-4 rounded-lg shadow">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="w-full h-40 object-contain mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-green-500">${product.available ? 'Available' : 'Out of Stock'}</span>
                            <div class="flex items-center">
                                <span class="mr-1">${product.rating}</span>
                                <i class="fas fa-star text-yellow-400"></i>
                            </div>
                        </div>
                        <div class="text-2xl font-bold mb-2">$${product.price}</div>
                        <button onclick="addToCart(${product.id})" 
                                class="w-full bg-green-500 text-white py-2 rounded-lg">
                            Add to Cart
                        </button>
                    </div>
                `).join('')}
            </div>

            <!-- Bottom Navigation -->
            ${renderBottomNav()}
        </div>
    `;
}

function renderSearch() {
    app.innerHTML = `
        <div class="container mx-auto px-4">
            <div class="relative mb-6">
                <input type="text" 
                       placeholder="Search products..." 
                       class="w-full p-4 rounded-lg bg-gray-200 focus:outline-none"
                       oninput="handleSearch(this.value)">
                <span class="absolute right-4 top-4">
                    <i class="fas fa-search text-gray-400"></i>
                </span>
            </div>

            <div id="searchResults" class="mb-20">
                <!-- Search results will be populated here -->
            </div>

            ${renderBottomNav()}
        </div>
    `;
}

function renderCart() {
    const total = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id).price * item.quantity), 0);
    
    app.innerHTML = `
        <div class="container mx-auto px-4">
            <h1 class="text-2xl font-bold my-4">Shopping Cart</h1>
            
            ${cart.length === 0 ? `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                    <p>Your cart is empty</p>
                </div>
            ` : `
                <div class="space-y-4 mb-4">
                    ${cart.map(item => {
                        const product = products.find(p => p.id === item.id);
                        return `
                            <div class="bg-white p-4 rounded-lg shadow flex items-center">
                                <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-contain mr-4">
                                <div class="flex-1">
                                    <h3 class="font-semibold">${product.name}</h3>
                                    <p class="text-green-500">$${product.price}</p>
                                    <div class="flex items-center mt-2">
                                        <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})" 
                                                class="bg-gray-200 px-3 py-1 rounded">-</button>
                                        <span class="mx-3">${item.quantity}</span>
                                        <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})" 
                                                class="bg-gray-200 px-3 py-1 rounded">+</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="bg-white p-4 rounded-lg shadow mb-20">
                    <div class="flex justify-between mb-4">
                        <span>Total:</span>
                        <span class="font-bold">$${total}</span>
                    </div>
                    <button onclick="checkout()" 
                            class="w-full bg-green-500 text-white py-3 rounded-lg">
                        Checkout
                    </button>
                </div>
            `}

            ${renderBottomNav()}
        </div>
    `;
}

function renderProfile() {
    app.innerHTML = `
        <div class="container mx-auto px-4">
            <h1 class="text-2xl font-bold my-4">Profile</h1>
            
            ${currentUser ? `
                <div class="bg-white p-4 rounded-lg shadow mb-4">
                    <div class="flex items-center mb-4">
                        <img src="${currentUser.avatar || 'https://via.placeholder.com/50'}" 
                             alt="Profile" 
                             class="w-16 h-16 rounded-full mr-4">
                        <div>
                            <h2 class="font-semibold">${currentUser.name}</h2>
                            <p class="text-gray-500">${currentUser.email}</p>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="text-center py-8">
                    <p>Please log in to view your profile</p>
                    <button onclick="login()" 
                            class="bg-green-500 text-white px-6 py-2 rounded-lg mt-4">
                        Login
                    </button>
                </div>
            `}

            <div class="space-y-4 mb-20">
                <button class="w-full bg-white p-4 rounded-lg shadow text-left">
                    <i class="fas fa-history mr-4"></i>
                    Order History
                </button>
                <button class="w-full bg-white p-4 rounded-lg shadow text-left">
                    <i class="fas fa-heart mr-4"></i>
                    Wishlist
                </button>
                <button class="w-full bg-white p-4 rounded-lg shadow text-left">
                    <i class="fas fa-cog mr-4"></i>
                    Settings
                </button>
                <button class="w-full bg-white p-4 rounded-lg shadow text-left">
                    <i class="fas fa-question-circle mr-4"></i>
                    Help Center
                </button>
                ${currentUser ? `
                    <button onclick="logout()" 
                            class="w-full bg-red-500 text-white p-4 rounded-lg text-center">
                        Logout
                    </button>
                ` : ''}
            </div>

            ${renderBottomNav()}
        </div>
    `;
}

function renderBottomNav() {
    return `
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div class="flex justify-around py-4">
                <button onclick="navigate('home')" 
                        class="${currentPage === 'home' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-home text-xl"></i>
                    <div class="text-xs">Home</div>
                </button>
                <button onclick="navigate('search')" 
                        class="${currentPage === 'search' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-search text-xl"></i>
                    <div class="text-xs">Search</div>
                </button>
                <button onclick="navigate('cart')" 
                        class="${currentPage === 'cart' ? 'text-green-500' : 'text-gray-500'} relative">
                    <i class="fas fa-shopping-cart text-xl"></i>
                    ${cart.length > 0 ? `
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            ${cart.length}
                        </span>
                    ` : ''}
                    <div class="text-xs">Cart</div>
                </button>
                <button onclick="navigate('profile')" 
                        class="${currentPage === 'profile' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-user text-xl"></i>
                    <div class="text-xs">Profile</div>
                </button>
            </div>
        </nav>
    `;
}

// Cart Functions
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    renderApp();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    renderApp();
}

function checkout() {
    alert('Checkout functionality will be implemented here');
}

// Search Functions
function handleSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!query) {
        searchResults.innerHTML = '';
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            ${filteredProducts.map(product => `
                <div class="bg-white p-4 rounded-lg shadow">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="w-full h-40 object-contain mb-4">
                    <h3 class="font-semibold mb-2">${product.name}</h3>
                    <p class="text-green-500 mb-2">$${product.price}</p>
                    <button onclick="addToCart(${product.id})" 
                            class="w-full bg-green-500 text-white py-2 rounded-lg">
                        Add to Cart
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Auth Functions
function login() {
    // Simulate login
    currentUser = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/50'
    };
    renderApp();
}

function logout() {
    currentUser = null;
    renderApp();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
