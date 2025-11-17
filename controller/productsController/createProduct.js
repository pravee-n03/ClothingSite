import Product from "../../models/ProductModel";
import errorController from "../errorController";

export default async function createProduct (req, res) {
    const {
      name,
      category,
      price,
      store,
      description,
      sale,
      newArival,
      available,
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || !store || !description) {
      return errorController(422, "data_incomplete", res);
    }

    // Validate store array
    if (!Array.isArray(store) || store.length === 0) {
      return errorController(422, "store must be a non-empty array", res);
    }

    // Validate each store item has required fields
    for (const item of store) {
      if (!item.color || !item.colorCode || !Array.isArray(item.sizeAmnt) || item.sizeAmnt.length === 0) {
        return errorController(422, "store items must have color, colorCode, and sizeAmnt array", res);
      }
      for (const sizeItem of item.sizeAmnt) {
        if (!sizeItem.size || sizeItem.amount === undefined || sizeItem.amount < 0) {
          return errorController(422, "sizeAmnt items must have valid size and non-negative amount", res);
        }
      }
    }

    try {
      const product = new Product({
        name: name.toLowerCase(),
        category,
        price,
        store,
        description,
        sale,
        newArival,
        available,
      });

      const createdProduct = await product.save();
      return res.status(200).json(createdProduct);
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        return errorController(409, "Product name already exists", res);
      }
      return errorController(500, error.message, res);
    }
  };
