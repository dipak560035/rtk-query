

import Product, { brands, categories } from "../models/Product.js";
import fs, { unlink } from "fs";

// ✅ Get all productsexport const getProducts = async (req, res) => {
  export const getProducts = async (req, res) => {
  try {
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'skip', 'search'];
    let queryObj = { ...req.query };

    excludedFields.forEach(val => delete queryObj[val]);

    // --- 🔍 SEARCH HANDLING FIX
    if (req.query.search) {
      const searchText = req.query.search.toLowerCase();

      const isCategory = Array.isArray(categories) &&
        categories.some(name => name.toLowerCase() === searchText);

      const isBrand = Array.isArray(brands) &&
        brands.some(name => name.toLowerCase() === searchText);

      if (isCategory) {
        queryObj.category = { $regex: searchText, $options: "i" };
      } else if (isBrand) {
        queryObj.brand = { $regex: searchText, $options: "i" };
      } else {
        queryObj.name = { $regex: searchText, $options: "i" };
      }
    }

    // --- 🧱 ADVANCED FILTERING FIX
    const output = Object.entries(queryObj).reduce((acc, [key, value]) => {
      const match = key.match(/^(.+)\[(.+)\]$/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        const parsedValue = isNaN(value) ? value : Number(value);
        acc[field] = { [operator]: parsedValue };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    let query = Product.find(output);

    // --- 📦 SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    // --- 🎯 FIELD SELECT
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    // --- 📄 PAGINATION FIX
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // --- 🧮 TOTAL SHOULD MATCH FILTER
    const total = await Product.countDocuments(output);
    const products = await query.skip(skip).limit(limit);

    return res.status(200).json({
      status: "success",
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err); // DEBUG
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
// ✅ Get single product
export const getProduct = async (req, res) => {
  try {
    const isExist = await Product.findById(req.params.id);

    if (!isExist) {
      return res.status(404).json({
        status: 'error',
        data: 'product not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      product: isExist
    });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};



// ✅ Create a new product safely
export const createProduct = async (req, res) => {
  try {
    // Debugging (optional)
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    const { title, price, detail, category, brand, stock } = req.body;

    // 1️⃣ Validate all required fields
    if (
      !title?.trim() ||
      !price ||
      !detail?.trim() ||
      !category?.trim() ||
      !brand?.trim() ||
      stock === undefined
    ) {
      // Delete temp uploaded image if exists
      if (req.imagePath) {
        try {
          fs.unlinkSync(`./uploads/${req.imagePath}`);
        } catch {}
      }
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: title, price, detail, category, brand, stock, image",
      });
    }

    // 2️⃣ Validate image
    if (!req.imagePath) {
      return res.status(400).json({
        status: "error",
        message: "Image file is required",
      });
    }

    const productName = title.trim();

    // 3️⃣ Check for duplicate name
    const existing = await Product.findOne({ name: productName });
    if (existing) {
      if (req.imagePath) {
        try {
          fs.unlinkSync(`./uploads/${req.imagePath}`);
        } catch {}
      }
      return res.status(400).json({
        status: "error",
        message: "Product with this title already exists",
      });
    }

    // 4️⃣ Create product
    const product = await Product.create({
      name: productName,           // title → name
      description: detail.trim(),  // detail → description
      price: Number(price),
      category: category.trim(),
      brand: brand.trim(),
      stock: Number(stock),
      image: req.imagePath,
      
    });

    return res.status(201).json({
      status: "success",
      message: "Product successfully added",
      product,
    });

  } catch (err) {
    // Delete uploaded image on error
    if (req.imagePath) {
      try {
        fs.unlinkSync(`./uploads/${req.imagePath}`);
      } catch {}
    }

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};



// ✅ Update product

export const updateProduct = async (req, res) => {
  const { title, price, detail, category, brand, stock } = req.body ?? {};

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      if (req.imagePath) fs.unlinkSync(`./uploads/${req.imagePath}`);
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    // Update only provided fields (mapped correctly)
    if (title) product.name = title.trim();
    if (detail) product.description = detail.trim();
    if (price) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category.trim();
    if (brand) product.brand = brand.trim();

    // Handle image replacement
    if (req.imagePath) {
      try {
        if (product.image) fs.unlinkSync(`./uploads/${product.image}`);
      } catch {}

      product.image = `uploads/${req.imagePath}`;
    }

    await product.save();

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product
    });

  } catch (err) {
    if (req.imagePath) try { fs.unlinkSync(`./uploads/${req.imagePath}`); } catch {}
    return res.status(500).json({ status: "error", message: err.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    // Remove image safely
    if (product.image) {
      try {
        fs.unlinkSync(product.image); // because image already includes "uploads/"
      } catch {}
    }

    await product.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};




































































































