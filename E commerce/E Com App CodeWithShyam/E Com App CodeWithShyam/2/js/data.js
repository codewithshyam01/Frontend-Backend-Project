const products = [
    {
        id: 1,
        name: "AirPods Pro",
        price: 145,
        category: "Electronic",
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
        category: "Electronic",
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
        category: "Electronic",
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
        category: "Electronic",
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
    }
];

const categories = ["All", "Electronic", "Beauty", "Fashion", "Toys"];

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
    }
];
