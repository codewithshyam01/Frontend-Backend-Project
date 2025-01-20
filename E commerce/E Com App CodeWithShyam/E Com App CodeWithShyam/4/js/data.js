const products = [
    {
        id: 1,
        name: "AirPods Pro",
        price: 145,
        category: "Electronics",
        rating: 5.0,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361",
        available: true,
        description: "Experience immersive sound with active noise cancellation and transparency mode. Features include adaptive EQ, spatial audio, and sweat resistance.",
        specs: ["Active Noise Cancellation", "Transparency Mode", "Spatial Audio", "24H Battery Life"],
        reviews: [
            { user: "John D.", rating: 5, comment: "Best earbuds I've ever owned!" },
            { user: "Sarah M.", rating: 5, comment: "Great sound quality and battery life" }
        ],
        colors: ["White"],
        stock: 50
    },
    {
        id: 2,
        name: "MacBook Air",
        price: 435,
        category: "Electronics",
        rating: 5.0,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1633027804000",
        available: true,
        description: "Supercharged by M2 chip. The world's thinnest laptop delivers powerful performance with up to 18 hours of battery life.",
        specs: ["M2 Chip", "13.6-inch Liquid Retina display", "8GB RAM", "256GB SSD"],
        reviews: [
            { user: "Mike R.", rating: 5, comment: "Perfect for work and entertainment" },
            { user: "Lisa K.", rating: 5, comment: "Amazing battery life!" }
        ],
        colors: ["Space Gray", "Silver", "Gold"],
        stock: 25
    },
    {
        id: 3,
        name: "Google Pixel",
        price: 699,
        category: "Electronics",
        rating: 4.8,
        image: "https://store.google.com/product/images/pixel_7a_sage.png",
        available: true,
        description: "The smartest and most powerful Pixel yet. Features an advanced camera system and the latest Android experience.",
        specs: ["6.4-inch OLED display", "128GB Storage", "12GB RAM", "50MP Camera"],
        reviews: [
            { user: "David W.", rating: 4.8, comment: "Best Android experience" },
            { user: "Emma S.", rating: 4.7, comment: "Amazing camera quality" }
        ],
        colors: ["Sage", "Black", "White"],
        stock: 30
    },
    {
        id: 4,
        name: "PlayStation 5",
        price: 499,
        category: "Electronics",
        rating: 4.9,
        image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        available: true,
        description: "Next-gen gaming console with lightning-fast loading, haptic feedback, and stunning 4K graphics.",
        specs: ["4K Resolution", "Ray Tracing", "825GB SSD", "120Hz Output"],
        reviews: [
            { user: "Tom H.", rating: 5, comment: "Gaming has never been better!" },
            { user: "Alice B.", rating: 4.8, comment: "Amazing graphics and speed" }
        ],
        colors: ["White"],
        stock: 15
    },
    {
        id: 5,
        name: "Nike Air Max",
        price: 129,
        category: "Fashion",
        rating: 4.7,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1a4e9b53-0181-441d-9c43-4a10d38dd93c/air-max-270-shoes-P0j2DN.png",
        available: true,
        description: "Featuring Nike's biggest heel Air unit yet, the Air Max 270 delivers visible cushioning under every step.",
        specs: ["Air Max cushioning", "Mesh upper", "Rubber outsole", "Foam midsole"],
        reviews: [
            { user: "Chris P.", rating: 4.7, comment: "Super comfortable for daily wear" },
            { user: "Maria L.", rating: 4.8, comment: "Stylish and great quality" }
        ],
        colors: ["Black", "White", "Red"],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
        stock: 40
    },
    {
        id: 6,
        name: "Levi's 501 Jeans",
        price: 89,
        category: "Fashion",
        rating: 4.6,
        image: "https://lsco.scene7.com/is/image/lsco/005010114-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=1.25,0.6,8&wid=2000&hei=2000",
        available: true,
        description: "The original straight fit jean that started it all. A cultural icon, worn by generations.",
        specs: ["100% Cotton", "Button fly", "Straight fit", "Five-pocket styling"],
        reviews: [
            { user: "Robert K.", rating: 4.6, comment: "Classic fit, never goes out of style" },
            { user: "Jennifer H.", rating: 4.5, comment: "Perfect fit and great quality" }
        ],
        colors: ["Blue", "Black", "Light Blue"],
        sizes: ["28x30", "30x30", "32x30", "34x30", "36x30"],
        stock: 60
    }
];

const categories = ["All", "Electronics", "Fashion", "Beauty", "Toys"];

const promotions = [
    {
        id: 1,
        title: "Summer Sale",
        discount: "20% OFF",
        code: "SUMMER20",
        validUntil: "2025-02-01"
    },
    {
        id: 2,
        title: "New User Special",
        discount: "₹100 OFF",
        code: "NEWUSER",
        validUntil: "2025-03-01"
    },
    {
        id: 3,
        title: "Fashion Week",
        discount: "30% OFF",
        code: "FASHION30",
        validUntil: "2025-01-31"
    }
];

// Notification data
const notifications = [
    {
        id: 1,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #1234 has been delivered successfully',
        timestamp: new Date(2025, 0, 14, 8, 30).getTime(),
        isRead: false,
        icon: 'fa-box-check',
        color: 'green'
    },
    {
        id: 2,
        type: 'promo',
        title: 'Special Offer',
        message: 'Get 50% off on all winter collection items!',
        timestamp: new Date(2025, 0, 14, 7, 15).getTime(),
        isRead: false,
        icon: 'fa-tag',
        color: 'orange'
    },
    {
        id: 3,
        type: 'news',
        title: 'New Collection Arrived',
        message: 'Check out our latest spring collection',
        timestamp: new Date(2025, 0, 13, 18, 45).getTime(),
        isRead: true,
        icon: 'fa-tshirt',
        color: 'blue'
    },
    {
        id: 4,
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully',
        timestamp: new Date(2025, 0, 13, 15, 20).getTime(),
        isRead: true,
        icon: 'fa-user-check',
        color: 'purple'
    }
];

// Trending tags data
const trendingTags = [
    { id: 1, name: "Summer Collection", searches: 15420 },
    { id: 2, name: "Casual Wear", searches: 12350 },
    { id: 3, name: "Sport Shoes", searches: 11200 },
    { id: 4, name: "Designer Bags", searches: 9870 },
    { id: 5, name: "Smart Watches", searches: 8940 },
    { id: 6, name: "Formal Wear", searches: 7650 },
    { id: 7, name: "Accessories", searches: 6780 },
    { id: 8, name: "Winter Wear", searches: 5430 },
    { id: 9, name: "Ethnic Wear", searches: 4980 },
    { id: 10, name: "Sunglasses", searches: 4320 },
    { id: 11, name: "Sneakers", searches: 3890 },
    { id: 12, name: "Denim", searches: 3450 },
    { id: 13, name: "Party Wear", searches: 3210 },
    { id: 14, name: "Fitness Gear", searches: 2980 },
    { id: 15, name: "Home Decor", searches: 2760 }
];
