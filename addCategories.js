const mongoose = require('mongoose');
const Category = require('./models/CategoryModel').default;

async function addCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/');

    const categories = [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      "Shoes",
      "Accessories",
      "Sportswear",
      "Formal Wear",
      "Casual Wear"
    ];

    for (const catName of categories) {
      const existingCat = await Category.findOne({ name: catName });
      if (!existingCat) {
        const newCat = new Category({ name: catName });
        await newCat.save();
        console.log(`Added category: ${catName}`);
      } else {
        console.log(`Category already exists: ${catName}`);
      }
    }

    console.log('All categories added successfully!');
  } catch (error) {
    console.error('Error adding categories:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addCategories();
