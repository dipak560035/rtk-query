

import Product from "../models/Product.js";
import fs, { unlink } from "fs";

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
  return res.status(200).json({
    status:'success',
    data:products
   });
  }
  catch (err) {
    return res.status(400).json({
      status: 'error',
      data: err.message
    });
  }
};

// ✅ Get a single product
export const getProduct =async (req, res) => {
  try {
    const isExist = await Product.findById(req.id);
   if(!isExist) return res.status(404).json({
    status:'error',
    data: 'product not found'
   });

   return res.status(200).json({
    status : 'success',
    data: isExist
   })

  } catch (err) {
   
  }
};

//✅ Create a new product
export const createProduct = async (req, res) => {
  const {title,price,detail,image,category,brand} = req.body ?? {};
  // const file = req.files.image;
  // file.mv(`./uploads/${file.name}`),(err)=>{
  //  }
  console.log(req.imagePath);
  try {
    await Product.create({
      title,
      price,
      detail,
      image: req.imagePath,
      category,
      brand
    });

    return res.status(201).json({
      status: 'success',
      data: 'Product successfully added',
    });
  } catch (err) {
    fs.unlink(`./uploads/${req.imagePath}`,(error) =>{
   return res.status(400).json({
      status: 'error',
      data: err.message
    });
    })
 
  }
};




// // ✅ Update product
// export const updateProduct = async (req, res) => {
//   const {title,price,detail,image,category,brand} = req.body ?? {};
// try {
//    const isExist = await Product.findById(req.params.id);

//   if(!isExist) {
//        if (req.imagePath){
//         fs.unlinkSync(`./uploads/${req.imagePath}`);
//         return res.status(404).json({
//     status : 'error',
//     data : 'product not found'})
//     } else {
//          return res.status(404).json({
//     status : 'error',
//     data : 'product not found'})
//     }
    
//   }
// isExist.title = title || isExist.title;
// isExist.price = price || isExist.price;
// isExist.detail = detail || isExist.detail;
// isExist.category = category || isExist.category;
// isExist.brand = brand || isExist.brand;

//  //updating file
// if (req.imagePath) {
//   fs.unlink(`./uploads/${isExist.image}`,async(err) =>{
//     isExist.image = req.imagePath;
//      await isExist.save();
//   return res.status(200).json({
//     status : 'success',
//     data : 'product sucessfully updated'
//   });
//   })

// } else {
//   await isExist.save();
//   return res.status(200).json({
//     status : 'success',
//     data : 'product sucessfully updated'
//   });
// }



//     } catch (err) {
//       if (req.imagePath) {
//         fs.unlink(`./uploads/${req.imagePath}`,(error) =>{
//           return res.status(500).json({
//     status:'error',
//     data: err.message
//   });
//         })
//       } else {
//         return res.status(500).json({
//     status:'error',
//     data: err.message
//   });
//       }
  
// }

// };





// ✅ Update product
export const updateProduct = async (req, res) => {
  const { title, price, detail, category, brand } = req.body ?? {};

  try {
    const isExist = await Product.findById(req.params.id);

    // ❌ Product not found
    if (!isExist) {
      if (req.imagePath) {
        fs.unlinkSync(`./uploads/${req.imagePath}`);
      }
      return res.status(404).json({
        status: 'error',
        data: 'product not found',
      });
    }

    // ✅ Update only provided fields
    isExist.title = title || isExist.title;
    isExist.price = price || isExist.price;
    isExist.detail = detail || isExist.detail;
    isExist.category = category || isExist.category;
    isExist.brand = brand || isExist.brand;

    // ✅ If new image provided
    if (req.imagePath) {
      try {
        if (isExist.image) {
          // remove old image if exists
          fs.unlinkSync(`./uploads/${isExist.image}`);
        }
      } catch (err) {
        // console.warn('⚠️ Old image delete failed:', err.message);
      }

      isExist.image = req.imagePath;
    }

    await isExist.save();

    return res.status(200).json({
      status: 'success',
      data: 'product successfully updated',
    });

  } catch (err) {
    // ❌ Error handling
    if (req.imagePath) {
      try {
        fs.unlinkSync(`./uploads/${req.imagePath}`);
      } catch (error) {
        console.warn('⚠️ Temp image delete failed:', error.message);
      }
    }

    return res.status(500).json({
      status: 'error',
      data: err.message,
    });
  }
};






// ✅ Delete product
export const deleteProduct = async (req, res) => {
 try {
  const isExist = await Product.findById(req.id);
  if(!isExist) return res.status(404).json({
    status : 'error',
    data : 'product not found'})
    fs.unlink(`./uploads/${isExist.image}`, async (err) =>{
      await isExist.deleteOne();
      return res.status(200).json({
        status:'success',
        data:'product deleted successfully'

      })
    })
    
 } catch (err) {
  return res.status(500).json({
    status:'error',
    data: err.message
  })

 }
};