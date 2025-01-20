// State management
let currentPage = 'home';
let cart = [];
let searchHistory = [];
let currentUser = null;
let wishlist = [];
let selectedProduct = null;
let selectedColor = null;
let selectedSize = null;
let deliveryOption = 'standard';

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
            selectedSize = data.sizes ? data.sizes[0] : null;
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
        case 'delivery':
            renderDelivery();
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
                        <button class="ripple p-2 relative" onclick="navigate('cart')">
                            <i class="fas fa-shopping-cart"></i>
                            ${cart.length > 0 ? `
                                <span class="absolute -top-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                    ${cart.length}
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
                            <button onclick="event.stopPropagation(); quickView(${product.id})" 
                                    class="absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                                <i class="fas fa-eye"></i>
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
                            <div class="flex justify-between items-center">
                                <div class="text-xl font-bold">₹${product.price}</div>
                                <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                                        class="ripple bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
                                    <i class="fas fa-cart-plus mr-2"></i>
                                    Add
                                </button>
                            </div>
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
                    <h1 class="text-xl font-bold">${selectedProduct.name}</h1>
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
                    <h3 class="text-lg font-semibold mb-3">Select Color</h3>
                    <div class="flex space-x-3">
                        ${selectedProduct.colors.map(color => `
                            <button onclick="selectColor('${color}')" 
                                    class="w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                                        selectedColor === color ? 'border-green-500' : 'border-gray-200'
                                    }">
                                <div class="w-8 h-8 rounded-full" 
                                     style="background-color: ${color.toLowerCase()}"></div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Size Selection (if applicable) -->
                ${selectedProduct.sizes ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-3">Select Size</h3>
                        <div class="flex flex-wrap gap-3">
                            ${selectedProduct.sizes.map(size => `
                                <button onclick="selectSize('${size}')"
                                        class="w-14 h-14 rounded-lg border-2 flex items-center justify-center ${
                                            selectedSize === size ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                        }">
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Quantity Picker -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3">Quantity</h3>
                    <div class="flex items-center space-x-4">
                        <button onclick="updateQuantity(selectedProduct.id, Math.max(1, (selectedProduct.quantity || 1) - 1))"
                                class="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="text-xl font-semibold">${selectedProduct.quantity || 1}</span>
                        <button onclick="updateQuantity(selectedProduct.id, (selectedProduct.quantity || 1) + 1)"
                                class="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <!-- Product Description -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3">Description</h3>
                    <p class="text-gray-600">${selectedProduct.description}</p>
                </div>

                <!-- Specifications -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3">Specifications</h3>
                    <ul class="space-y-2">
                        ${selectedProduct.specs.map(spec => `
                            <li class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-2"></i>
                                ${spec}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Action Buttons -->
                <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex space-x-4">
                    <button onclick="addToCart(selectedProduct.id)" 
                            class="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                        <i class="fas fa-cart-plus mr-2"></i>
                        Add to Cart
                    </button>
                    <button onclick="buyNow(selectedProduct.id)"
                            class="flex-1 bg-black text-white py-3 rounded-lg font-semibold">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quickViewHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">${product.name}</h3>
                        <button onclick="closeQuickView()" class="text-gray-500">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-contain mb-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-2xl font-bold">₹${product.price}</div>
                        <div class="flex items-center">
                            <span class="mr-1">${product.rating}</span>
                            <i class="fas fa-star text-yellow-400"></i>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex space-x-4">
                        <button onclick="addToCart(${product.id}); closeQuickView()" 
                                class="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                            <i class="fas fa-cart-plus mr-2"></i>
                            Add to Cart
                        </button>
                        <button onclick="navigate('product', ${JSON.stringify(product)}); closeQuickView()" 
                                class="flex-1 bg-black text-white py-3 rounded-lg font-semibold">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const quickViewElement = document.createElement('div');
    quickViewElement.id = 'quickView';
    quickViewElement.innerHTML = quickViewHtml;
    document.body.appendChild(quickViewElement);
}

function closeQuickView() {
    const quickView = document.getElementById('quickView');
    if (quickView) {
        quickView.remove();
    }
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

function renderDelivery() {
    const total = calculateSubtotal();
    const deliveryFee = deliveryOption === 'express' ? 50 : 0;
    const finalTotal = total + deliveryFee;

    app.innerHTML = `
        <div class="min-h-screen pb-20">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('cart')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold">Delivery Details</h1>
                </div>
                <!-- Progress Steps -->
                <div class="flex justify-between px-8 py-4 border-t">
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <span class="text-xs text-green-500">Cart</span>
                    </div>
                    <div class="flex-1 flex items-center justify-center">
                        <div class="h-1 w-full bg-green-500"></div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <span class="text-xs text-green-500">Delivery</span>
                    </div>
                    <div class="flex-1 flex items-center justify-center">
                        <div class="h-1 w-full bg-gray-300"></div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-1">
                            <i class="fas fa-check"></i>
                        </div>
                        <span class="text-xs text-gray-500">Complete</span>
                    </div>
                </div>
            </div>

            <!-- Delivery Form -->
            <form id="deliveryForm" class="p-4 space-y-6" onsubmit="event.preventDefault(); placeOrder();">
                <!-- Contact Information -->
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h2 class="text-lg font-semibold mb-4">Contact Information</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                            <input type="text" id="fullName" required
                                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                   placeholder="Enter your full name">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                            <input type="tel" id="phone" required
                                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                   placeholder="Enter your phone number">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input type="email" id="email" required
                                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                   placeholder="Enter your email">
                        </div>
                    </div>
                </div>

                <!-- Delivery Address -->
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h2 class="text-lg font-semibold mb-4">Delivery Address</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
                            <input type="text" id="address" required
                                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                   placeholder="Enter street address">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-medium mb-2">City</label>
                                <input type="text" id="city" required
                                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                       placeholder="Enter city">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-medium mb-2">Postal Code</label>
                                <input type="text" id="postalCode" required
                                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                       placeholder="Enter postal code">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-medium mb-2">State</label>
                            <input type="text" id="state" required
                                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                                   placeholder="Enter state">
                        </div>
                    </div>
                </div>

                <!-- Delivery Options -->
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h2 class="text-lg font-semibold mb-4">Delivery Options</h2>
                    <div class="space-y-3">
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="deliveryOption" value="standard" 
                                   ${deliveryOption === 'standard' ? 'checked' : ''}
                                   onchange="updateDeliveryOption('standard')"
                                   class="w-4 h-4 text-green-500">
                            <div class="ml-3 flex-1">
                                <div class="font-medium">Standard Delivery</div>
                                <div class="text-sm text-gray-500">3-5 business days</div>
                            </div>
                            <div class="font-medium text-green-500">Free</div>
                        </label>
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="deliveryOption" value="express"
                                   ${deliveryOption === 'express' ? 'checked' : ''}
                                   onchange="updateDeliveryOption('express')"
                                   class="w-4 h-4 text-green-500">
                            <div class="ml-3 flex-1">
                                <div class="font-medium">Express Delivery</div>
                                <div class="text-sm text-gray-500">1-2 business days</div>
                            </div>
                            <div class="font-medium text-green-500">₹50</div>
                        </label>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-gray-600">Total Amount</div>
                        <div class="text-xl font-bold">₹${finalTotal}</div>
                    </div>
                    <button type="submit"
                            class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                        <i class="fas fa-lock mr-2"></i>
                        Place Order
                    </button>
                </div>
            </form>
        </div>

        <!-- Success Modal -->
        <div id="successModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
            <div class="bg-white rounded-lg p-6 w-[90%] max-w-md">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-3xl text-green-500 success-checkmark"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Order Placed Successfully!</h3>
                    <p class="text-gray-600 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>
                    <button onclick="navigate('home')" 
                            class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateDeliveryOption(option) {
    deliveryOption = option;
    renderDelivery();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    navigate('delivery');
}

function placeOrder() {
    const form = document.getElementById('deliveryForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postalCode').value,
        deliveryOption: deliveryOption,
        total: calculateSubtotal() + (deliveryOption === 'express' ? 50 : 0)
    };

    // Store order details if needed
    localStorage.setItem('lastOrder', JSON.stringify(formData));

    // Show success modal
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('hidden');
    }

    // Clear cart
    cart = [];
    saveCart();
    
    // After 2 seconds, redirect to home
    setTimeout(() => {
        navigate('home');
    }, 2000);
}

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

function renderCart() {
    const total = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id).price * item.quantity), 0);
    
    app.innerHTML = `
        <div class="pb-32">
            <!-- Header -->
            <div class="bg-white sticky top-0 z-10">
                <div class="flex items-center p-4">
                    <button onclick="navigate('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold">Shopping Cart (${cart.length})</h1>
                </div>
            </div>

            ${cart.length === 0 ? `
                <div class="flex flex-col items-center justify-center p-8">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
                    <button onclick="navigate('home')" 
                            class="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold">
                        Start Shopping
                    </button>
                </div>
            ` : `
                <!-- Cart Items -->
                <div class="space-y-4 p-4">
                    ${cart.map(item => {
                        const product = products.find(p => p.id === item.id);
                        if (!product) return '';
                        return `
                            <div class="bg-white rounded-lg shadow-md p-4">
                                <div class="flex items-center">
                                    <img src="${product.image}" 
                                         alt="${product.name}" 
                                         class="w-20 h-20 object-contain mr-4">
                                    <div class="flex-1">
                                        <h3 class="font-medium mb-1">${product.name}</h3>
                                        <div class="text-gray-500 mb-2">
                                            ${item.color ? `Color: ${item.color}` : ''}
                                            ${item.size ? ` • Size: ${item.size}` : ''}
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <div class="text-xl font-bold">₹${product.price}</div>
                                            <div class="flex items-center space-x-3">
                                                <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})"
                                                        class="w-8 h-8 rounded-full border-2 flex items-center justify-center ${item.quantity === 1 ? 'text-red-500 border-red-500' : ''}">
                                                    <i class="fas ${item.quantity === 1 ? 'fa-trash' : 'fa-minus'}"></i>
                                                </button>
                                                <span class="font-medium">${item.quantity}</span>
                                                <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})"
                                                        class="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Order Summary -->
                <div class="bg-white p-4 mb-4">
                    <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-medium">₹${calculateSubtotal()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span class="font-medium">Free</span>
                        </div>
                        <div class="border-t pt-2 mt-2">
                            <div class="flex justify-between">
                                <span class="font-semibold">Total</span>
                                <span class="font-bold text-xl">₹${calculateSubtotal()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `}

            ${cart.length > 0 ? `
                <!-- Checkout Button -->
                <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                    <button onclick="checkout()" 
                            class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                        <i class="fas fa-lock mr-2"></i>
                        Proceed to Checkout (₹${calculateSubtotal()})
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function calculateSubtotal() {
    return cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

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

function selectSize(size) {
    selectedSize = size;
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
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            color: selectedColor,
            size: selectedSize
        });
    }

    saveCart();
    showToast('Added to cart');
    renderApp();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    saveCart();
    renderApp();
}

function resetCart() {
    cart = [];
    renderApp();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Initialize cart from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderApp();
});

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
