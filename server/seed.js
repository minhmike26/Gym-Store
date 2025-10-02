const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Sample gym products data
const sampleProducts = [
  {
    name: "Whey Protein 100% Gold Standard",
    description: "Premium whey protein powder with 24g protein per serving. Perfect for muscle building and recovery.",
    price: 89.99,
    category: "protein",
    brand: "Optimum Nutrition",
    weight: "5 lbs",
    flavor: "Chocolate",
    stock: 50,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
        alt: "Whey Protein Gold Standard"
      }
    ],
    featured: true,
    rating: {
      average: 4.8,
      count: 1250
    }
  },
  {
    name: "Creatine Monohydrate",
    description: "Pure creatine monohydrate powder for enhanced strength and muscle mass. 100% pure and unflavored.",
    price: 24.99,
    category: "supplements",
    brand: "MuscleTech",
    weight: "1 lb",
    flavor: "Unflavored",
    stock: 75,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "Creatine Monohydrate"
      }
    ],
    featured: true,
    rating: {
      average: 4.6,
      count: 890
    }
  },
  {
    name: "Adjustable Dumbbells Set",
    description: "Professional adjustable dumbbells with weight range from 5-50 lbs each. Perfect for home gym.",
    price: 299.99,
    category: "equipment",
    brand: "Bowflex",
    weight: "50 lbs each",
    stock: 25,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "Adjustable Dumbbells"
      }
    ],
    featured: true,
    rating: {
      average: 4.7,
      count: 320
    }
  },
  {
    name: "Pre-Workout Energy",
    description: "High-energy pre-workout supplement with caffeine, beta-alanine, and creatine for maximum performance.",
    price: 39.99,
    category: "supplements",
    brand: "C4",
    weight: "30 servings",
    flavor: "Fruit Punch",
    stock: 40,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
        alt: "Pre-Workout Energy"
      }
    ],
    featured: false,
    rating: {
      average: 4.4,
      count: 650
    }
  },
  {
    name: "Gym Tank Top",
    description: "Comfortable and breathable gym tank top made from moisture-wicking fabric. Perfect for intense workouts.",
    price: 19.99,
    category: "clothing",
    brand: "Nike",
    weight: "Lightweight",
    stock: 100,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
        alt: "Gym Tank Top"
      }
    ],
    featured: false,
    rating: {
      average: 4.3,
      count: 420
    }
  },
  {
    name: "Resistance Bands Set",
    description: "Complete resistance bands set with 5 different resistance levels. Perfect for home workouts and travel.",
    price: 29.99,
    category: "accessories",
    brand: "Fit Simplify",
    weight: "2 lbs",
    stock: 60,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "Resistance Bands Set"
      }
    ],
    featured: false,
    rating: {
      average: 4.5,
      count: 180
    }
  },
  {
    name: "BCAA Amino Acids",
    description: "Essential branched-chain amino acids for muscle recovery and growth. Available in multiple flavors.",
    price: 34.99,
    category: "supplements",
    brand: "Scivation",
    weight: "30 servings",
    flavor: "Watermelon",
    stock: 35,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
        alt: "BCAA Amino Acids"
      }
    ],
    featured: true,
    rating: {
      average: 4.5,
      count: 520
    }
  },
  {
    name: "Yoga Mat Premium",
    description: "High-quality non-slip yoga mat with excellent grip and cushioning. Perfect for yoga and stretching.",
    price: 49.99,
    category: "accessories",
    brand: "Lululemon",
    weight: "3 lbs",
    stock: 45,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        alt: "Yoga Mat Premium"
      }
    ],
    featured: false,
    rating: {
      average: 4.8,
      count: 280
    }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} products successfully`);

    // Display added products
    console.log('\n📦 Added Products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Run the seed script
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
