// State management
let currentPage = 'home';
let cart = [];
let searchHistory = [];
let currentUser = null;
let wishlist = [];
let selectedProduct = null;
let selectedColor = null;

// DOM Elements
const app = document.getElementById('app');

// Router
function navigate(page, data = null) {
    // Add animation class
    app.classList.add('fade-out');
    
    setTimeout(() => {
        currentPage = page;
        if (data) {
            selectedProduct = data;
            selectedColor = data.colors[0];
        }
        renderApp();
        app.classList.remove('fade-out');
    }, 150);
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
        case 'product':
            renderProductDetail();
            break;
        case 'wishlist':
            renderWishlist();
            break;
        default:
            renderHome();
    }
}

function renderHome() {
    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-green-500 text-white p-4 shadow-lg">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">ShopApp</h1>
                    <div class="flex items-center space-x-4">
                        <button class="ripple p-2" onclick="navigate('wishlist')">
                            <i class="fas fa-heart"></i>
                            ${wishlist.length > 0 ? `
                                <span class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                    ${wishlist.length}
                                </span>
                            ` : ''}
                        </button>
                        <button class="ripple p-2 relative">
                            <i class="fas fa-bell"></i>
                            <span class="absolute top-0 right-0 bg-yellow-500 w-2 h-2 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="p-4">
                <div class="relative" onclick="navigate('search')">
                    <input type="text" 
                           placeholder="Search products..." 
                           class="w-full p-3 rounded-lg bg-white shadow-md focus:outline-none"
                           readonly>
                    <span class="absolute right-4 top-3">
                        <i class="fas fa-search text-gray-400"></i>
                    </span>
                </div>
            </div>

            <!-- Promotions Carousel -->
            <div class="px-4 mb-6">
                <div class="overflow-x-auto scroll-smooth flex space-x-4 pb-4">
                    ${promotions.map(promo => `
                        <div class="flex-shrink-0 w-80 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                            <h3 class="text-xl font-bold mb-2">${promo.title}</h3>
                            <p class="text-2xl font-bold mb-2">${promo.discount}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Use code: ${promo.code}</span>
                                <button class="bg-white text-green-500 px-4 py-1 rounded-full text-sm font-bold">
                                    Copy
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Categories -->
            <div class="px-4 mb-6">
                <div class="flex overflow-x-auto scroll-smooth space-x-4 pb-2">
                    ${categories.map(category => `
                        <button class="ripple flex-shrink-0 px-6 py-2 rounded-full ${
                            category === 'All' ? 'bg-green-500 text-white' : 'bg-white shadow'
                        } whitespace-nowrap">
                            ${category}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 gap-4 px-4">
                ${products.map(product => `
                    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden" 
                         onclick="navigate('product', ${JSON.stringify(product)})">
                        <div class="relative">
                            <img src="${product.image}" 
                                 alt="${product.name}" 
                                 class="w-full h-40 object-contain p-4">
                            <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
                                    class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                                <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-300'}"></i>
                            </button>
                        </div>
                        <div class="p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-green-500 font-medium">
                                    ${product.available ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <div class="flex items-center">
                                    <span class="mr-1">${product.rating}</span>
                                    <i class="fas fa-star text-yellow-400"></i>
                                </div>
                            </div>
                            <h3 class="font-medium mb-1 truncate">${product.name}</h3>
                            <div class="text-xl font-bold">₹${product.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${renderBottomNav()}
    `;
}

function renderProductDetail() {
    if (!selectedProduct) return navigate('home');

    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold flex-1">${selectedProduct.name}</h1>
                    <button onclick="shareProduct(${selectedProduct.id})" class="ml-4">
                        <i class="fas fa-share-alt text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Product Images -->
            <div class="bg-white mb-4">
                <div class="relative">
                    <img src="${selectedProduct.image}" 
                         alt="${selectedProduct.name}" 
                         class="w-full h-72 object-contain p-4">
                    <button onclick="toggleWishlist(${selectedProduct.id})" 
                            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <i class="fas fa-heart ${wishlist.includes(selectedProduct.id) ? 'text-red-500' : 'text-gray-300'} text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Product Info -->
            <div class="bg-white p-4 mb-4">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold mb-2">${selectedProduct.name}</h2>
                        <div class="flex items-center">
                            <div class="flex items-center mr-4">
                                <span class="text-xl font-bold mr-2">${selectedProduct.rating}</span>
                                <i class="fas fa-star text-yellow-400"></i>
                            </div>
                            <span class="text-gray-500">${selectedProduct.reviews.length} reviews</span>
                        </div>
                    </div>
                    <div class="text-3xl font-bold text-green-500">₹${selectedProduct.price}</div>
                </div>

                <!-- Color Selection -->
                <div class="mb-6">
                    <h3 class="font-semibold mb-2">Select Color</h3>
                    <div class="flex space-x-4">
                        ${selectedProduct.colors.map(color => `
                            <button onclick="selectColor('${color}')" 
                                    class="w-12 h-12 rounded-full border-2 ${
                                        color === selectedColor 
                                        ? 'border-green-500' 
                                        : 'border-gray-200'
                                    } flex items-center justify-center">
                                <span class="w-8 h-8 rounded-full" 
                                      style="background-color: ${color.toLowerCase()}"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Stock Info -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
                    <div class="flex items-center">
                        <i class="fas fa-box text-green-500 mr-2"></i>
                        <span>${selectedProduct.stock} units left</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-truck text-green-500 mr-2"></i>
                        <span>Free Delivery</span>
                    </div>
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <h3 class="font-semibold mb-2">Description</h3>
                    <p class="text-gray-600 leading-relaxed">${selectedProduct.description}</p>
                </div>

                <!-- Specifications -->
                <div class="mb-6">
                    <h3 class="font-semibold mb-2">Specifications</h3>
                    <ul class="space-y-2">
                        ${selectedProduct.specs.map(spec => `
                            <li class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-2"></i>
                                ${spec}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Reviews -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold">Reviews</h3>
                        <button class="text-green-500">See All</button>
                    </div>
                    <div class="space-y-4">
                        ${selectedProduct.reviews.map(review => `
                            <div class="border-b pb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                                        <i class="fas fa-user text-gray-500"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium">${review.user}</div>
                                        <div class="flex items-center">
                                            <span class="text-yellow-400 mr-1">${review.rating}</span>
                                            <i class="fas fa-star text-yellow-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-gray-600">${review.comment}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Bottom Action -->
            <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                <div class="flex space-x-4">
                    <button onclick="addToCart(${selectedProduct.id})" 
                            class="ripple flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold">
                        Add to Cart
                    </button>
                    <button onclick="buyNow(${selectedProduct.id})" 
                            class="ripple flex-1 bg-black text-white py-3 rounded-lg font-semibold">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderWishlist() {
    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold">Wishlist</h1>
                </div>
            </div>

            ${wishlist.length === 0 ? `
                <div class="flex flex-col items-center justify-center p-8">
                    <i class="fas fa-heart text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-center">Your wishlist is empty</p>
                    <button onclick="navigate('home')" 
                            class="mt-4 text-green-500 font-semibold">
                        Continue Shopping
                    </button>
                </div>
            ` : `
                <div class="grid grid-cols-2 gap-4 p-4">
                    ${products.filter(p => wishlist.includes(p.id)).map(product => `
                        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden" 
                             onclick="navigate('product', ${JSON.stringify(product)})">
                            <div class="relative">
                                <img src="${product.image}" 
                                     alt="${product.name}" 
                                     class="w-full h-40 object-contain p-4">
                                <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
                                        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                                    <i class="fas fa-heart text-red-500"></i>
                                </button>
                            </div>
                            <div class="p-4">
                                <h3 class="font-medium mb-1 truncate">${product.name}</h3>
                                <div class="text-xl font-bold">₹${product.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>

        ${renderBottomNav()}
    `;
}

function renderBottomNav() {
    return `
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 bottom-nav">
            <div class="flex justify-around py-2">
                <button onclick="navigate('home')" 
                        class="ripple flex flex-col items-center p-2 ${currentPage === 'home' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-home text-xl mb-1"></i>
                    <span class="text-xs">Home</span>
                </button>
                <button onclick="navigate('search')" 
                        class="ripple flex flex-col items-center p-2 ${currentPage === 'search' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-search text-xl mb-1"></i>
                    <span class="text-xs">Search</span>
                </button>
                <button onclick="navigate('cart')" 
                        class="ripple flex flex-col items-center p-2 ${currentPage === 'cart' ? 'text-green-500' : 'text-gray-500'} relative">
                    <i class="fas fa-shopping-cart text-xl mb-1"></i>
                    ${cart.length > 0 ? `
                        <span class="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            ${cart.length}
                        </span>
                    ` : ''}
                    <span class="text-xs">Cart</span>
                </button>
                <button onclick="navigate('profile')" 
                        class="ripple flex flex-col items-center p-2 ${currentPage === 'profile' ? 'text-green-500' : 'text-gray-500'}">
                    <i class="fas fa-user text-xl mb-1"></i>
                    <span class="text-xs">Profile</span>
                </button>
            </div>
        </nav>
    `;
}

// Utility Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast('Added to wishlist');
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
    }
    renderApp();
}

function selectColor(color) {
    selectedColor = color;
    renderApp();
}

function shareProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: product.description,
            url: window.location.href
        });
    } else {
        showToast('Share feature not supported');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function buyNow(productId) {
    addToCart(productId);
    navigate('cart');
}

// Cart Functions
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    showToast('Added to cart');
    renderApp();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
        showToast('Item removed from cart');
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    renderApp();
}

function checkout() {
    if (!currentUser) {
        showToast('Please login to checkout');
        navigate('profile');
        return;
    }
    showToast('Processing your order...');
    setTimeout(() => {
        cart = [];
        showToast('Order placed successfully!');
        renderApp();
    }, 1500);
}

// Search Functions
function renderSearch() {
    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <div class="flex-1 relative">
                        <input type="text" 
                               placeholder="Search products..." 
                               class="w-full p-3 rounded-lg bg-gray-100 focus:outline-none pr-10"
                               oninput="handleSearch(this.value)"
                               autofocus>
                        <span class="absolute right-3 top-3">
                            <i class="fas fa-search text-gray-400"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Recent Searches -->
            <div class="p-4" id="recentSearches">
                ${searchHistory.length > 0 ? `
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-semibold">Recent Searches</h3>
                            <button onclick="clearSearchHistory()" 
                                    class="text-green-500 text-sm">Clear All</button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${searchHistory.map(term => `
                                <button onclick="setSearchTerm('${term}')"
                                        class="px-4 py-2 bg-white rounded-full text-sm shadow">
                                    ${term}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Search Results -->
            <div id="searchResults" class="px-4"></div>

            ${renderBottomNav()}
        </div>
    `;
}

function handleSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const recentSearches = document.getElementById('recentSearches');

    if (!query) {
        searchResults.innerHTML = '';
        recentSearches.style.display = 'block';
        return;
    }

    recentSearches.style.display = 'none';
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-search text-gray-300 text-4xl mb-4"></i>
                <p class="text-gray-500">No products found</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            ${filteredProducts.map(product => `
                <div class="product-card bg-white rounded-lg shadow-md overflow-hidden" 
                     onclick="navigate('product', ${JSON.stringify(product)})">
                    <div class="relative">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="w-full h-40 object-contain p-4">
                        <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
                                class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                            <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-300'}"></i>
                        </button>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium mb-1 truncate">${product.name}</h3>
                        <div class="text-xl font-bold">₹${product.price}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function setSearchTerm(term) {
    const input = document.querySelector('input[type="text"]');
    input.value = term;
    handleSearch(term);
}

function clearSearchHistory() {
    searchHistory = [];
    renderApp();
}

// Cart Render Function
function renderCart() {
    const total = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id).price * item.quantity), 0);
    
    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold">Shopping Cart</h1>
                </div>
            </div>
            
            ${cart.length === 0 ? `
                <div class="flex flex-col items-center justify-center p-8">
                    <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-center mb-4">Your cart is empty</p>
                    <button onclick="navigate('home')" 
                            class="px-6 py-2 bg-green-500 text-white rounded-lg">
                        Start Shopping
                    </button>
                </div>
            ` : `
                <div class="p-4 space-y-4">
                    ${cart.map(item => {
                        const product = products.find(p => p.id === item.id);
                        return `
                            <div class="bg-white p-4 rounded-lg shadow-md flex items-center">
                                <img src="${product.image}" 
                                     alt="${product.name}" 
                                     class="w-20 h-20 object-contain mr-4">
                                <div class="flex-1">
                                    <h3 class="font-semibold mb-1">${product.name}</h3>
                                    <p class="text-green-500 font-bold mb-2">₹${product.price}</p>
                                    <div class="flex items-center">
                                        <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})" 
                                                class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="mx-4 font-medium">${item.quantity}</span>
                                        <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})" 
                                                class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="text-xl font-bold">
                                    ₹${product.price * item.quantity}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Order Summary -->
                <div class="fixed bottom-16 left-0 right-0 bg-white p-4 shadow-lg">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-500">Total Amount</span>
                        <span class="text-2xl font-bold">₹${total}</span>
                    </div>
                    <button onclick="checkout()" 
                            class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
                        Proceed to Checkout
                    </button>
                </div>
            `}

            ${renderBottomNav()}
        </div>
    `;
}

// Profile Functions
function login() {
    currentUser = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/50',
        phone: '+1234567890',
        address: '123 Street, City, Country'
    };
    showToast('Logged in successfully');
    renderApp();
}

function logout() {
    currentUser = null;
    showToast('Logged out successfully');
    renderApp();
}

function renderProfile() {
    app.innerHTML = `
        <div class="pb-16">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <h1 class="text-xl font-bold flex-1">Profile</h1>
                    ${currentUser ? `
                        <button onclick="logout()" class="text-red-500">
                            <i class="fas fa-sign-out-alt text-xl"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            
            ${currentUser ? `
                <!-- User Info -->
                <div class="bg-white p-6 mb-4">
                    <div class="flex items-center mb-6">
                        <img src="${currentUser.avatar}" 
                             alt="Profile" 
                             class="w-20 h-20 rounded-full mr-4">
                        <div>
                            <h2 class="text-xl font-bold">${currentUser.name}</h2>
                            <p class="text-gray-500">${currentUser.email}</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <i class="fas fa-phone text-green-500 w-6"></i>
                            <span class="ml-2">${currentUser.phone}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt text-green-500 w-6"></i>
                            <span class="ml-2">${currentUser.address}</span>
                        </div>
                    </div>
                </div>

                <!-- Menu Items -->
                <div class="bg-white">
                    <button class="w-full p-4 flex items-center justify-between border-b">
                        <div class="flex items-center">
                            <i class="fas fa-box text-green-500 w-8"></i>
                            <span>My Orders</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button onclick="navigate('wishlist')" 
                            class="w-full p-4 flex items-center justify-between border-b">
                        <div class="flex items-center">
                            <i class="fas fa-heart text-green-500 w-8"></i>
                            <span>Wishlist</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button class="w-full p-4 flex items-center justify-between border-b">
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt text-green-500 w-8"></i>
                            <span>Addresses</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button class="w-full p-4 flex items-center justify-between border-b">
                        <div class="flex items-center">
                            <i class="fas fa-credit-card text-green-500 w-8"></i>
                            <span>Payment Methods</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button class="w-full p-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-cog text-green-500 w-8"></i>
                            <span>Settings</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                </div>
            ` : `
                <div class="flex flex-col items-center justify-center p-8">
                    <i class="fas fa-user-circle text-gray-300 text-6xl mb-4"></i>
                    <p class="text-gray-500 text-center mb-4">Please login to view your profile</p>
                    <button onclick="login()" 
                            class="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold">
                        Login
                    </button>
                </div>
            `}

            ${renderBottomNav()}
        </div>
    `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    
    // Enable pull-to-refresh
    let touchStart = 0;
    let touchEnd = 0;
    
    app.addEventListener('touchstart', e => {
        touchStart = e.touches[0].clientY;
    }, { passive: true });
    
    app.addEventListener('touchmove', e => {
        touchEnd = e.touches[0].clientY;
        
        if (app.scrollTop === 0 && touchEnd > touchStart && (touchEnd - touchStart) > 100) {
            showToast('Refreshing...');
            setTimeout(() => renderApp(), 1000);
        }
    }, { passive: true });
});
