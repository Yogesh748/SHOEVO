import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    // We link the order to the user who placed it using their MongoDB _id
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to our User model
        required: true 
    },
    items: { 
        type: Array, // We'll store an array of product objects (name, price, quantity, image)
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    address: { 
        type: Object, // Store the delivery address object
        required: true 
    },
    status: { 
        type: String, 
        default: "Processing" // Default status for new orders
    },
    date: { 
        type: Date, 
        default: Date.now() 
    },
    // We can add payment status later if needed
    // payment: { type: Boolean, default: false } 
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;

