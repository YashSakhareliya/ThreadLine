// Mock data for development
export const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
];

export const fabricShops = [
  {
    id: 1,
    name: 'Royal Fabrics',
    city: 'Mumbai',
    address: '123 Fashion Street, Mumbai',
    phone: '+91 98765 43210',
    email: 'contact@royalfabrics.com',
    rating: 4.8,
    image:
      'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium fabrics for all occasions',
    established: '2010',
  },
  {
    id: 2,
    name: 'Silk Paradise',
    city: 'Delhi',
    address: '456 Chandni Chowk, Delhi',
    phone: '+91 98765 43211',
    email: 'info@silkparadise.com',
    rating: 4.6,
    image:
      'https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Authentic silk fabrics from across India',
    established: '2008',
  },
  {
    id: 3,
    name: 'Cotton World',
    city: 'Bangalore',
    address: '789 Commercial Street, Bangalore',
    phone: '+91 98765 43212',
    email: 'hello@cottonworld.com',
    rating: 4.7,
    image:
      'https://images.pexels.com/photos/6069114/pexels-photo-6069114.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Best quality cotton fabrics',
    established: '2015',
  },
];

export const fabrics = [
  {
    id: 1,
    shopId: 1,
    name: 'Premium Silk Saree Fabric',
    price: 2500,
    stock: 15,
    category: 'Silk',
    color: 'Royal Blue',
    material: 'Pure Silk',
    width: '44 inches',
    image:
      'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxurious silk fabric perfect for sarees',
    ratings: 4.7,
    totalPurchases: 156,
    likes: 89,
    images: [
      'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069131/pexels-photo-6069131.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069132/pexels-photo-6069132.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      weight: '120 GSM',
      weave: 'Plain Weave',
      care: 'Dry Clean Only',
      origin: 'Varanasi, India',
      thread_count: '200 TC',
    },
    reviews: [
      {
        id: 1,
        customerName: 'Anita Sharma',
        rating: 5,
        comment:
          'Beautiful silk quality! The color is vibrant and the texture is smooth. Perfect for my saree.',
        date: '2024-01-18',
        images: [
          'https://images.pexels.com/photos/6069133/pexels-photo-6069133.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
      },
      {
        id: 2,
        customerName: 'Rajesh Kumar',
        rating: 4,
        comment: 'Good quality fabric. Fast delivery and well packaged.',
        date: '2024-01-15',
        images: [],
      },
    ],
  },
  {
    id: 2,
    shopId: 1,
    name: 'Cotton Kurta Fabric',
    price: 800,
    stock: 25,
    category: 'Cotton',
    color: 'White',
    material: '100% Cotton',
    width: '42 inches',
    image:
      'https://images.pexels.com/photos/6069116/pexels-photo-6069116.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Soft cotton fabric ideal for kurtas',
    ratings: 4.5,
    totalPurchases: 203,
    likes: 67,
    images: [
      'https://images.pexels.com/photos/6069116/pexels-photo-6069116.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069134/pexels-photo-6069134.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      weight: '140 GSM',
      weave: 'Twill Weave',
      care: 'Machine Wash',
      origin: 'Gujarat, India',
      thread_count: '180 TC',
    },
    reviews: [
      {
        id: 1,
        customerName: 'Vikram Singh',
        rating: 5,
        comment: 'Excellent cotton quality. Very comfortable and breathable.',
        date: '2024-01-16',
        images: [],
      },
    ],
  },
  {
    id: 3,
    shopId: 2,
    name: 'Banarasi Silk',
    price: 3500,
    stock: 8,
    category: 'Silk',
    color: 'Golden',
    material: 'Banarasi Silk',
    width: '44 inches',
    image:
      'https://images.pexels.com/photos/6069117/pexels-photo-6069117.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Traditional Banarasi silk with intricate patterns',
    ratings: 4.9,
    totalPurchases: 89,
    likes: 134,
    images: [
      'https://images.pexels.com/photos/6069117/pexels-photo-6069117.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069135/pexels-photo-6069135.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069136/pexels-photo-6069136.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      weight: '200 GSM',
      weave: 'Jacquard Weave',
      care: 'Dry Clean Only',
      origin: 'Varanasi, India',
      thread_count: '300 TC',
    },
    reviews: [
      {
        id: 1,
        customerName: 'Deepika Agarwal',
        rating: 5,
        comment:
          'Absolutely stunning Banarasi silk! The golden work is exquisite.',
        date: '2024-01-14',
        images: [
          'https://images.pexels.com/photos/6069137/pexels-photo-6069137.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
      },
    ],
  },
  {
    id: 4,
    shopId: 3,
    name: 'Organic Cotton',
    price: 600,
    stock: 30,
    category: 'Cotton',
    color: 'Natural',
    material: 'Organic Cotton',
    width: '40 inches',
    image:
      'https://images.pexels.com/photos/6069118/pexels-photo-6069118.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Eco-friendly organic cotton fabric',
    ratings: 4.3,
    totalPurchases: 178,
    likes: 45,
    images: [
      'https://images.pexels.com/photos/6069118/pexels-photo-6069118.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069138/pexels-photo-6069138.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      weight: '160 GSM',
      weave: 'Plain Weave',
      care: 'Machine Wash',
      origin: 'Madhya Pradesh, India',
      thread_count: '150 TC',
    },
    reviews: [
      {
        id: 1,
        customerName: 'Eco Lover',
        rating: 4,
        comment: 'Great organic cotton. Soft and sustainable choice.',
        date: '2024-01-13',
        images: [],
      },
    ],
  },
];

export const tailors = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    city: 'Mumbai',
    specialization: ['Suits', 'Shirts', 'Traditional Wear'],
    experience: 15,
    rating: 4.9,
    priceRange: '₹500 - ₹2000',
    phone: '+91 98765 43220',
    email: 'rajesh@tailoring.com',
    image:
      'https://images.pexels.com/photos/6069119/pexels-photo-6069119.jpeg?auto=compress&cs=tinysrgb&w=800',
    bio: 'Master tailor with 15 years of experience in premium stitching',
    portfolio: [
      'https://images.pexels.com/photos/6069120/pexels-photo-6069120.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069121/pexels-photo-6069121.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069122/pexels-photo-6069122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069123/pexels-photo-6069123.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069124/pexels-photo-6069124.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069125/pexels-photo-6069125.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    reviews: [
      {
        id: 1,
        customerName: 'Priya Sharma',
        rating: 5,
        comment:
          'Excellent work on my wedding lehenga. The stitching quality is outstanding and the fit is perfect. Highly recommended!',
        date: '2024-01-15',
        images: [
          'https://images.pexels.com/photos/6069126/pexels-photo-6069126.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
      },
      {
        id: 2,
        customerName: 'Amit Kumar',
        rating: 4,
        comment:
          'Great attention to detail. The suit came out exactly as I wanted. Will definitely come back for more work.',
        date: '2024-01-10',
        images: [],
      },
      {
        id: 3,
        customerName: 'Sneha Patel',
        rating: 5,
        comment:
          'Amazing craftsmanship! The traditional wear was beautifully made with intricate details.',
        date: '2024-01-05',
        images: [
          'https://images.pexels.com/photos/6069127/pexels-photo-6069127.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
      },
    ],
    completedProjects: 89,
    responseTime: '2 hours',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    city: 'Delhi',
    specialization: ['Sarees', 'Lehengas', 'Blouses'],
    experience: 12,
    rating: 4.8,
    priceRange: '₹400 - ₹1800',
    phone: '+91 98765 43221',
    email: 'priya@stitching.com',
    image:
      'https://images.pexels.com/photos/6069123/pexels-photo-6069123.jpeg?auto=compress&cs=tinysrgb&w=800',
    bio: "Specialist in women's traditional and contemporary wear",
    portfolio: [
      'https://images.pexels.com/photos/6069124/pexels-photo-6069124.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069125/pexels-photo-6069125.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069128/pexels-photo-6069128.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6069129/pexels-photo-6069129.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    reviews: [
      {
        id: 1,
        customerName: 'Kavya Reddy',
        rating: 5,
        comment:
          'Beautiful saree blouse work. The fitting is perfect and the design is exactly what I wanted.',
        date: '2024-01-12',
        images: [],
      },
      {
        id: 2,
        customerName: 'Meera Singh',
        rating: 4,
        comment:
          'Good quality work on my lehenga. Professional service and timely delivery.',
        date: '2024-01-08',
        images: [
          'https://images.pexels.com/photos/6069130/pexels-photo-6069130.jpeg?auto=compress&cs=tinysrgb&w=400',
        ],
      },
    ],
    completedProjects: 67,
    responseTime: '4 hours',
  },
];

export const orders = [
  {
    id: 1,
    customerId: 1,
    items: [
      { fabricId: 1, quantity: 2, price: 2500 },
      { fabricId: 2, quantity: 1, price: 800 },
    ],
    total: 5800,
    status: 'Delivered',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    trackingNumber: 'TL123456789',
    estimatedDelivery: '2024-01-18',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai',
      phone: '+91 98765 43230',
      city: 'Mumbai',
      pincode: '400001',
    },
    shippingDetails: {
      carrier: 'Blue Dart',
      method: 'Express Delivery',
      cost: 100,
      trackingUrl: 'https://bluedart.com/track/TL123456789',
    },
  },
  {
    id: 2,
    customerId: 1,
    items: [{ fabricId: 3, quantity: 1, price: 3500 }],
    total: 3500,
    status: 'Shipped',
    orderDate: '2024-01-20',
    trackingNumber: 'TL987654321',
    estimatedDelivery: '2024-01-25',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai',
      phone: '+91 98765 43230',
      city: 'Mumbai',
      pincode: '400001',
    },
    shippingDetails: {
      carrier: 'DTDC',
      method: 'Standard Delivery',
      cost: 80,
      trackingUrl: 'https://dtdc.com/track/TL987654321',
    },
  },
  {
    id: 3,
    customerId: 1,
    items: [{ fabricId: 2, quantity: 3, price: 800 }],
    total: 2400,
    status: 'Pending',
    orderDate: '2024-01-22',
    estimatedDelivery: '2024-01-28',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai',
      phone: '+91 98765 43230',
      city: 'Mumbai',
      pincode: '400001',
    },
    shippingDetails: {
      carrier: 'India Post',
      method: 'Standard Delivery',
      cost: 60,
    },
  },
];
