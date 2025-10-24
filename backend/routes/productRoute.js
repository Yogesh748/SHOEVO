// import express from 'express';
// import Product from '../models/productModel.js';
// import multer from 'multer';
// import path from 'path';
// import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
// import fs from 'fs'; // Import File System module for deleting images

// const productRouter = express.Router();

// // --- Image Storage Configuration ---
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory to save files
//     },
//     filename: (req, file, cb) => {
//         // Unique filename: timestamp + original name
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// // File filter to accept only common image types
// const imageFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) { // Check if mimetype starts with 'image/'
//         cb(null, true); // Accept file
//     } else {
//         cb(new Error('Invalid file type. Only image files are allowed.'), false); // Reject file
//     }
// };

// // Multer configuration for handling multiple image uploads
// const upload = multer({
//     storage: storage,
//     fileFilter: imageFileFilter,
//     limits: { fileSize: 1024 * 1024 * 5 } // Optional: 5MB file size limit
// });
// // --- End Image Config ---

// // --- API ROUTES ---

// // GET /api/product - Fetch all products (Publicly accessible)
// productRouter.get("/", async (req, res) => {
//     try {
//         console.log("Backend: GET /api/product request received.");
//         const products = await Product.find({}); // Fetch all products from DB
//         console.log(`Backend: Found ${products.length} products in DB.`);
//         res.json({ success: true, data: products });
//     } catch (error) {
//         console.error("Backend: Error fetching products:", error);
//         res.status(500).json({ success: false, message: "Server error fetching products" });
//     }
// });

// // GET /api/product/:id - Fetch a single product by its MongoDB _id (Publicly accessible)
// productRouter.get("/:id", async (req, res) => {
//     try {
//         const productId = req.params.id;
//         console.log(`Backend: Received GET request for /api/product/${productId}`);
//         const product = await Product.findById(productId); // Find by _id

//         if (!product) {
//             console.log("Backend: Product not found:", productId);
//             return res.status(404).json({ success: false, message: "Product not found." });
//         }
//         console.log("Backend: Found product:", product.name);
//         res.json({ success: true, data: product });

//     } catch (error) {
//         console.error(`Backend: Error fetching product ${req.params.id}:`, error);
//         // Handle specific error if ID format is invalid
//         if (error.kind === 'ObjectId') {
//             return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//         }
//         res.status(500).json({ success: false, message: "Server error fetching product" });
//     }
// });

// // POST /api/product/add - Add a new product (Admin Only)
// // Requires authentication (authMiddleware) and admin role (isAdmin)
// // Expects multipart/form-data with fields and up to 4 files named 'images'
// productRouter.post("/add", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
//     console.log("Backend: POST /api/product/add request received.");
//     console.log("Body:", req.body);
//     console.log("Files:", req.files ? `${req.files.length} files` : 'No files');
//     try {
//         // Validate file upload
//         if (!req.files || req.files.length === 0) {
//              return res.status(400).json({ success: false, message: "No image files uploaded or invalid file type." });
//         }
//         // Create image URLs
//         const imageUrls = req.files.map(file => `http://localhost:4000/images/${file.filename}`);

//         // Validate and parse price
//         const priceAsNumber = Number(req.body.price);
//         if (isNaN(priceAsNumber)) {
//             return res.status(400).json({ success: false, message: "Price must be a valid number." });
//         }

//         // Validate and parse sizes
//          const sizesArray = req.body.sizes
//              ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
//              : [];
//          if (sizesArray.length === 0 && req.body.sizes?.trim() !== "") {
//               return res.status(400).json({ success: false, message: "Sizes must be comma-separated numbers." });
//          }

//         // Create new product document
//         const product = new Product({
//             name: req.body.name,
//             description: req.body.description,
//             category: req.body.category,
//             price: priceAsNumber,
//             audience: req.body.audience,
//             images: imageUrls, // Save array of URLs
//             sizes: sizesArray,
//         });

//         // Save to database
//         await product.save();
//         console.log("Backend: Product added successfully:", product.name);
//         res.status(201).json({ success: true, message: "Product Added Successfully!" }); // Use 201 status for created resource

//     } catch (error) {
//         console.error("Backend: Error adding product:", error);
//         // Handle specific errors
//         if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
//         if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
//         if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
//         res.status(500).json({ success: false, message: "Server error adding product", error: error.message });
//     }
// });

// // PUT /api/product/update/:id - Update an existing product (Admin Only)
// // Requires authentication and admin role
// // Expects product ID in URL, updated fields in body, potentially new images
// productRouter.put("/update/:id", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
//     const productId = req.params.id;
//     console.log(`Backend: Received PUT request for /api/product/update/${productId}`);
//     console.log("Body:", req.body);
//     console.log("Files:", req.files ? `${req.files.length} files` : 'No new files');

//     try {
//         // Find the product to update
//         const productToUpdate = await Product.findById(productId);
//         if (!productToUpdate) {
//             return res.status(404).json({ success: false, message: "Product not found." });
//         }

//         // --- Prepare Update Data ---
//         const updateData = {
//             name: req.body.name,
//             description: req.body.description,
//             category: req.body.category,
//             price: Number(req.body.price),
//             audience: req.body.audience,
//             // Parse sizes, fallback to existing if not provided or invalid
//             sizes: req.body.sizes ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : productToUpdate.sizes,
//         };

//         // Basic validation for price
//         if (isNaN(updateData.price)) {
//              return res.status(400).json({ success: false, message: "Price must be a valid number." });
//         }
//          // Basic validation for sizes if provided
//         if (req.body.sizes && updateData.sizes.length === 0 && req.body.sizes.trim() !== "") {
//              return res.status(400).json({ success: false, message: "Sizes must be comma-separated numbers." });
//         }


//         // --- Handle Image Update ---
//         if (req.files && req.files.length > 0) {
//             console.log("Backend: New images uploaded for update. Deleting old ones...");
//             // Delete old image files associated with this product
//             if (productToUpdate.images && productToUpdate.images.length > 0) {
//                  productToUpdate.images.forEach(imageUrl => {
//                      const filename = imageUrl.split('/').pop();
//                      const imagePath = path.join('uploads', filename);
//                      // Use existsSync to avoid error if file already deleted
//                      if (fs.existsSync(imagePath)) {
//                          fs.unlink(imagePath, (err) => {
//                              if (err) console.error("Error deleting old image:", imagePath, err);
//                              else console.log("Old image deleted:", imagePath);
//                          });
//                      } else {
//                           console.warn("Old image file not found, skipping delete:", imagePath);
//                      }
//                  });
//             }
//             // Assign new image URLs to updateData
//             updateData.images = req.files.map(file => `http://localhost:4000/images/${file.filename}`);
//         } else {
//             console.log("Backend: No new images uploaded for update.");
//             // If no new images, the existing images remain unchanged implicitly
//         }
//         // --- End Image Update ---

//         // Update the product in the database
//         const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
//             new: true, // Return the modified document rather than the original
//             runValidators: true // Ensure schema validations are run on update
//         });

//         if (!updatedProduct) { // Should not happen if findById worked, but good check
//             return res.status(404).json({ success: false, message: "Product not found after update attempt." });
//         }

//         console.log("Backend: Product updated successfully:", updatedProduct.name);
//         res.json({ success: true, message: "Product updated successfully!", data: updatedProduct });

//     } catch (error) {
//         console.error(`Backend: Error updating product ${productId}:`, error);
//         if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
//         if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
//         if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
//         // Handle specific error if ID format is invalid
//         if (error.kind === 'ObjectId') {
//              return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//         }
//         res.status(500).json({ success: false, message: "Server error updating product", error: error.message });
//     }
// });

// // DELETE /api/product/remove/:id - Remove a product (Admin Only)
// // Requires authentication and admin role
// productRouter.delete("/remove/:id", authMiddleware, isAdmin, async (req, res) => {
//     console.log(`Backend: DELETE /api/product/remove/${req.params.id} request received.`);
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ success: false, message: "Product not found." });

//         // Delete image files
//         if (product.images && product.images.length > 0) {
//              product.images.forEach(imageUrl => {
//                  const filename = imageUrl.split('/').pop();
//                  const imagePath = path.join('uploads', filename);
//                  if (fs.existsSync(imagePath)) {
//                       fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting image file:", imagePath, err); else console.log("Image file deleted:", imagePath); });
//                  } else {
//                       console.warn("Image file not found for deletion:", imagePath);
//                  }
//              });
//         }
//         // Delete product from DB
//         await Product.findByIdAndDelete(productId);
//         console.log("Backend: Product removed successfully:", productId);
//         res.json({ success: true, message: "Product removed successfully!" });
//     } catch (error) {
//         console.error("Backend: Error removing product:", error);
//          // Handle specific error if ID format is invalid
//          if (error.kind === 'ObjectId') {
//               return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//          }
//         res.status(500).json({ success: false, message: "Server error removing product", error: error.message });
//     }
// });

// export default productRouter;

// import express from 'express';
// import Product from '../models/productModel.js';
// import multer from 'multer';
// import path from 'path';
// import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
// import fs from 'fs';

// const productRouter = express.Router();

// // --- Image Storage Configuration ---
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, 'uploads/'); },
//     filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
// });
// const imageFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) { cb(null, true); }
//     else { cb(new Error('Invalid file type. Only image files are allowed.'), false); }
// };
// const upload = multer({ storage: storage, fileFilter: imageFileFilter, limits: { fileSize: 1024 * 1024 * 5 }});
// // --- End Image Config ---

// // GET /api/product - Fetch all products
// productRouter.get("/", async (req, res) => {
//     try {
//         console.log("Backend: GET /api/product request received.");
//         const products = await Product.find({});
//         console.log(`Backend: Found ${products.length} products in DB.`);
//         res.json({ success: true, data: products });
//     } catch (error) {
//         console.error("Backend: Error fetching products:", error);
//         res.status(500).json({ success: false, message: "Server error fetching products" });
//     }
// });

// // GET /api/product/:id - Fetch a single product by _id
// productRouter.get("/:id", async (req, res) => {
//     try {
//         const productId = req.params.id;
//         console.log(`Backend: GET /api/product/${productId} request received.`);
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ success: false, message: "Product not found." });
//         }
//         res.json({ success: true, data: product });
//     } catch (error) {
//         console.error(`Backend: Error fetching product ${req.params.id}:`, error);
//         if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//         res.status(500).json({ success: false, message: "Server error fetching product" });
//     }
// });

// // POST /api/product/add - Add a new product (Admin Only)
// productRouter.post("/add", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
//     console.log("Backend: POST /api/product/add request.");
//     try {
//         if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "No image files uploaded or invalid file type." });
        
//         const imageUrls = req.files.map(file => `http://localhost:4000/images/${file.filename}`);
//         const priceAsNumber = Number(req.body.price);
//         if (isNaN(priceAsNumber)) return res.status(400).json({ success: false, message: "Price must be a valid number." });
        
//         const sizesArray = req.body.sizes ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : [];
//         if (sizesArray.length === 0 && req.body.sizes?.trim() !== "") return res.status(400).json({ success: false, message: "Sizes must be comma-separated numbers." });
        
//         const stockQuantity = Number(req.body.stock);
//         if (isNaN(stockQuantity) || stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative number." });

//         const product = new Product({
//             name: req.body.name,
//             description: req.body.description,
//             category: req.body.category,
//             price: priceAsNumber,
//             audience: req.body.audience,
//             images: imageUrls,
//             sizes: sizesArray,
//             stock: stockQuantity,
//             // Convert string "true" or boolean true to boolean
//             isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
//             isTrending: req.body.isTrending === 'true' || req.body.isTrending === true
//         });
        
//         await product.save();
//         res.status(201).json({ success: true, message: "Product Added Successfully!" });

//     } catch (error) {
//         console.error("Backend: Error adding product:", error);
//         if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
//         if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
//         if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
//         res.status(500).json({ success: false, message: "Server error adding product", error: error.message });
//     }
// });

// // PUT /api/product/update/:id - Update an existing product (Admin Only)
// productRouter.put("/update/:id", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
//      const productId = req.params.id;
//      console.log(`Backend: PUT /api/product/update/${productId}`);
//      try {
//          const productToUpdate = await Product.findById(productId);
//          if (!productToUpdate) return res.status(404).json({ success: false, message: "Product not found." });

//          const priceAsNumber = Number(req.body.price);
//          if (isNaN(priceAsNumber)) return res.status(400).json({ success: false, message: "Price must be a valid number." });
         
//          const sizesArray = req.body.sizes ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : productToUpdate.sizes;
//          if (req.body.sizes && sizesArray.length === 0 && req.body.sizes.trim() !== "") return res.status(400).json({ success: false, message: "Sizes must be valid numbers." });
         
//          const stockQuantity = Number(req.body.stock);
//          if (isNaN(stockQuantity) || stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative number." });

//          const updateData = {
//              name: req.body.name,
//              description: req.body.description,
//              category: req.body.category,
//              price: priceAsNumber,
//              audience: req.body.audience,
//              sizes: sizesArray,
//              stock: stockQuantity,
//              // Convert string "true" or boolean true to boolean
//              isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
//              isTrending: req.body.isTrending === 'true' || req.body.isTrending === true
//          };

//          if (req.files && req.files.length > 0) {
//              if (productToUpdate.images && productToUpdate.images.length > 0) {
//                   productToUpdate.images.forEach(imageUrl => {
//                       const filename = imageUrl.split('/').pop();
//                       const imagePath = path.join('uploads', filename);
//                       if (fs.existsSync(imagePath)) { fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting old image:", imagePath, err); }); }
//                   });
//              }
//              updateData.images = req.files.map(file => `http://localhost:4000/images/${file.filename}`);
//          }

//          const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
//          if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found after update." });

//          res.json({ success: true, message: "Product updated successfully!", data: updatedProduct });
//      } catch (error) {
//          console.error(`Backend: Error updating product ${productId}:`, error);
//          if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
//          if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
//          if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
//          if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//          res.status(500).json({ success: false, message: "Server error updating product", error: error.message });
//      }
// });

// // DELETE /api/product/remove/:id - Remove a product (Admin Only)
// productRouter.delete("/remove/:id", authMiddleware, isAdmin, async (req, res) => {
//     console.log(`Backend: DELETE /api/product/remove/${req.params.id}`);
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ success: false, message: "Product not found." });

//         if (product.images && product.images.length > 0) {
//              product.images.forEach(imageUrl => {
//                  const filename = imageUrl.split('/').pop();
//                  const imagePath = path.join('uploads', filename);
//                  if (fs.existsSync(imagePath)) { fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting image file:", imagePath, err); }); }
//              });
//         }
//         await Product.findByIdAndDelete(productId);
//         res.json({ success: true, message: "Product removed successfully!" });
//     } catch (error) {
//         console.error("Backend: Error removing product:", error);
//          if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
//         res.status(500).json({ success: false, message: "Server error removing product", error: error.message });
//     }
// });

// export default productRouter;

import express from 'express';
import Product from '../models/productModel.js';
import multer from 'multer';
import path from 'path';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import fs from 'fs';

const productRouter = express.Router();

// --- Image Storage Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { cb(null, true); }
    else { cb(new Error('Invalid file type. Only image files are allowed.'), false); }
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter, limits: { fileSize: 1024 * 1024 * 5 }});
// --- End Image Config ---

// GET /api/product - Fetch all products
productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        console.error("Backend: Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error fetching products" });
    }
});

// GET /api/product/:id - Fetch a single product by _id
productRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error(`Backend: Error fetching product ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
        res.status(500).json({ success: false, message: "Server error fetching product" });
    }
});

// POST /api/product/add - Add a new product (Admin Only)
productRouter.post("/add", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "No image files uploaded or invalid file type." });
        
        // --- THIS IS THE FIX ---
        // Use the live backend URL from environment variables
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
        const imageUrls = req.files.map(file => `${backendUrl}/images/${file.filename}`);
        // --- END FIX ---

        const priceAsNumber = Number(req.body.price);
        if (isNaN(priceAsNumber)) return res.status(400).json({ success: false, message: "Price must be a valid number." });
        
        const sizesArray = req.body.sizes ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : [];
        if (sizesArray.length === 0 && req.body.sizes?.trim() !== "") return res.status(400).json({ success: false, message: "Sizes must be comma-separated numbers." });
        
        const stockQuantity = Number(req.body.stock);
        if (isNaN(stockQuantity) || stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative number." });

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: priceAsNumber,
            audience: req.body.audience,
            images: imageUrls, // Use the new dynamic URLs
            sizes: sizesArray,
            stock: stockQuantity,
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
            isTrending: req.body.isTrending === 'true' || req.body.isTrending === true
        });
        
        await product.save();
        res.status(201).json({ success: true, message: "Product Added Successfully!" });

    } catch (error) {
        console.error("Backend: Error adding product:", error);
        if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
        if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
        res.status(500).json({ success: false, message: "Server error adding product", error: error.message });
    }
});

// PUT /api/product/update/:id - Update an existing product (Admin Only)
productRouter.put("/update/:id", authMiddleware, isAdmin, upload.array("images", 4), async (req, res) => {
     const productId = req.params.id;
     try {
         const productToUpdate = await Product.findById(productId);
         if (!productToUpdate) return res.status(404).json({ success: false, message: "Product not found." });

         const priceAsNumber = Number(req.body.price);
         if (isNaN(priceAsNumber)) return res.status(400).json({ success: false, message: "Price must be a valid number." });
         
         const sizesArray = req.body.sizes ? req.body.sizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : productToUpdate.sizes;
         if (req.body.sizes && sizesArray.length === 0 && req.body.sizes.trim() !== "") return res.status(400).json({ success: false, message: "Sizes must be valid numbers." });
         
         const stockQuantity = Number(req.body.stock);
         if (isNaN(stockQuantity) || stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative number." });

         const updateData = {
             name: req.body.name,
             description: req.body.description,
             category: req.body.category,
             price: priceAsNumber,
             audience: req.body.audience,
             sizes: sizesArray,
             stock: stockQuantity,
             isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
             isTrending: req.body.isTrending === 'true' || req.body.isTrending === true
         };

         if (req.files && req.files.length > 0) {
             if (productToUpdate.images && productToUpdate.images.length > 0) {
                 productToUpdate.images.forEach(imageUrl => {
                     const filename = imageUrl.split('/').pop();
                     const imagePath = path.join('uploads', filename);
                     if (fs.existsSync(imagePath)) { fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting old image:", imagePath, err); }); }
                 });
             }
             // --- THIS IS THE FIX ---
             // Use the environment variable for the base URL
             const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
             updateData.images = req.files.map(file => `${backendUrl}/images/${file.filename}`);
             // --- END FIX ---
         }

         const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
         if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found after update." });

         res.json({ success: true, message: "Product updated successfully!", data: updatedProduct });
     } catch (error) {
         console.error(`Backend: Error updating product ${productId}:`, error);
         if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
         if (error.message.includes('Invalid file type')) return res.status(400).json({ success: false, message: error.message });
         if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
         if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
         res.status(500).json({ success: false, message: "Server error updating product", error: error.message });
     }
});

// DELETE /api/product/remove/:id - Remove a product (Admin Only)
productRouter.delete("/remove/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found." });

        if (product.images && product.images.length > 0) {
             product.images.forEach(imageUrl => {
                 const filename = imageUrl.split('/').pop();
                 const imagePath = path.join('uploads', filename);
                 if (fs.existsSync(imagePath)) { fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting image file:", imagePath, err); }); }
             });
        }
        await Product.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product removed successfully!" });
    } catch (error) {
        console.error("Backend: Error removing product:", error);
         if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid Product ID format." });
        res.status(500).json({ success: false, message: "Server error removing product", error: error.message });
    }
});

export default productRouter;