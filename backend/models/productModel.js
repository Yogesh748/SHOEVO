// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     // Make description optional to handle old data from seeder
//     description: { type: String, required: false },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     audience: { type: String, required: true, enum: ['Men', 'Women', 'Kids'] },
//     images: { type: [String], required: true }, // Array of image URLs
//     sizes: { type: [Number], required: true }, // Array of numbers
//     dateAdded: { type: Date, default: Date.now }
// }, { timestamps: true }); // Adds createdAt and updatedAt

// // Mongoose automatically creates 'products' collection
// const Product = mongoose.model("Product", productSchema);

// export default Product;
// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: false // Kept optional to handle data potentially missing it
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     audience: {
//         type: String,
//         required: true,
//         enum: ['Men', 'Women', 'Kids']
//     },
//     images: {
//         type: [String], // Array of image URLs
//         required: true
//     },
//     sizes: {
//         type: [Number], // Array of numbers
//         required: true
//     },
//     stock: {
//         type: Number,
//         required: true,
//         default: 0, // Ensure default is set
//         min: 0
//     },
//     dateAdded: {
//         type: Date,
//         default: Date.now
//     }
// }, { timestamps: true }); // Adds createdAt and updatedAt

// const Product = mongoose.model("Product", productSchema);

// export default Product;

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    audience: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Kids']
    },
    images: {
        type: [String], // Array of image URLs
        required: true
    },
    sizes: {
        type: [Number], // Array of numbers
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    // --- NEW FIELDS ---
    isFeatured: {
        type: Boolean,
        default: false // Not featured by default
    },
    isTrending: {
        type: Boolean,
        default: false // Not trending by default
    },
    // --- END NEW FIELDS ---
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

const Product = mongoose.model("Product", productSchema);

export default Product;
