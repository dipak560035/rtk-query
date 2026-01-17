

import Product, { brands, categories } from "../models/Product.js";
import fs, { unlink } from "fs";

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
  //   const products = await Product.find({}).sort('price');
  // return res.status(200).json({
  //   status:'success',
  //   products
  //  });
  // }


    const exludedFields = ['page', 'limit', 'sort', 'fields', 'skip', 'search'];
    let queryObj = { ...req.query };

    exludedFields.forEach((val) => {
      delete queryObj[val];
    })



    if (req.query.search) {
      const searchText = req.query.search;


      if (categories.some((name) => name.toLowerCase() === searchText.toLowerCase())) {
        queryObj.category = { $regex: searchText, $options: 'i' };

      } else if (brands.some((name) => name.toLowerCase() === searchText.toLowerCase())) {
        queryObj.brand = { $regex: searchText, $options: 'i' };
      } else {
        queryObj.title = { $regex: searchText, $options: 'i' };
      }


    }

    // { 'rating[gt]': '4' }
    // {rating: {$gt: 4}}
    const output = Object.entries(queryObj).reduce((acc, [key, value]) => {
      const match = key.match(/^(.+)\[(.+)\]$/);  // <-- FIXED REGEX
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

    console.log(output);
    let query = Product.find(output);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * 10;

    const total = await Product.countDocuments();
    const products = await query.skip(skip).limit(limit);

    return res.status(200).json({
      status: 'success',
      total,
      products,
     totalPages: Math.ceil(total / limit)
    });


  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};



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
      image: `uploads/${req.imagePath}`,
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
