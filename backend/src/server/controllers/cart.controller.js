

// import { Cart } from '../models/cart.js'
// import { Product } from '../models/Product.js'


// export const getCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id })
//     .populate('items.product')

//   res.json(cart || { items: [] })
// }

// export const addToCart = async (req, res) => {
//   const { productId, qty = 1 } = req.body

//   const product = await Product.findById(productId)
//   if (!product) {
//     return res.status(404).json({ message: 'Product not found' })
//   }

//   let cart = await Cart.findOne({ user: req.user._id })
//   if (!cart) {
//     cart = await Cart.create({ user: req.user._id, items: [] })
//   }

//   const item = cart.items.find(
//     i => i.product.toString() === productId
//   )

//   if (item) {
//     item.qty += qty
//   } else {
//     cart.items.push({ product: productId, qty })
//   }

//   await cart.save()
//   res.json(cart)
// }

// export const updateCartItem = async (req, res) => {
//   const { productId, qty } = req.body

//   const cart = await Cart.findOne({ user: req.user._id })
//   if (!cart) return res.status(404).json({ message: 'Cart not found' })

//   const item = cart.items.find(
//     i => i.product.toString() === productId
//   )

//   if (!item) {
//     return res.status(404).json({ message: 'Item not in cart' })
//   }

//   item.qty = qty
//   await cart.save()
//   res.json(cart)
// }

// export const removeCartItem = async (req, res) => {
//   const { productId } = req.params

//   const cart = await Cart.findOne({ user: req.user._id })
//   if (!cart) return res.status(404).json({ message: 'Cart not found' })

//   cart.items = cart.items.filter(
//     i => i.product.toString() !== productId
//   )

//   await cart.save()
//   res.json(cart)
// }

// export const clearCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id })
//   if (!cart) return res.json({ items: [] })

//   cart.items = []
//   await cart.save()
//   res.json(cart)
// }














































import { Cart } from '../models/cart.js';
import { Product } from '../models/Product.js';

/* ================= GET USER CART ================= */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= ADD ITEM TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      const newQty = Number(item.qty) + Number(qty);
      item.qty = Math.max(1, Math.min(newQty, product.stock));
    } else {
      const clamped = Math.max(1, Math.min(Number(qty), product.stock));
      cart.items.push({ product: productId, qty: clamped });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, data: populatedCart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ITEM QUANTITY ================= */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    item.qty = Math.max(1, Math.min(Number(qty), product.stock));
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, data: populatedCart });
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= REMOVE ITEM FROM CART ================= */
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, data: populatedCart });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= CLEAR CART ================= */
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }

    const populatedCart = await cart.populate('items.product');
    res.json({ success: true, data: populatedCart });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
