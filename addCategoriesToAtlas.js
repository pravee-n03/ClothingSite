require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const Category = require('./models/CategoryModel').default;

async function addCategoriesToAtlas() {
  try {
    // This will use the MONGODB_URI from your environment variables
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.log('Please set your MongoDB Atlas connection string in .env.local or environment variables');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');

    // Clear existing categories (optional - remove this if you want to keep existing ones)
    console.log('🧹 Clearing existing categories...');
    await Category.deleteMany({});
    console.log('✅ Cleared existing categories');

    // Add default categories
    const categories = [
      "T-Shirts",
      "Hoodies",
      "Jackets",
      "Pants",
      "Shoes",
      "Accessories"
    ];

    console.log('📝 Adding categories...');
    for (const catName of categories) {
      const newCat = new Category({ name: catName });
      await newCat.save();
      console.log(`✅ Added category: ${catName}`);
    }

    console.log('🎉 All categories added successfully!');
    console.log('📋 Categories added:', categories.join(', '));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

addCategoriesToAtlas();
