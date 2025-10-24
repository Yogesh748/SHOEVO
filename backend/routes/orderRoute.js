// import express from 'express';
// import Order from '../models/orderModel.js';
// import User from '../models/userModel.js';
// import Product from '../models/productModel.js'; // Import Product model
// // Removed PromoCode import
// import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose'; // Import mongoose

// dotenv.config();
// const orderRouter = express.Router();

// // Helper function to adjust stock
// const adjustStock = async (items, direction, session = null) => {
//     try {
//         const bulkOps = items.map(item => ({
//             updateOne: {
//                 filter: { _id: item._id },
//                 update: { $inc: { stock: item.quantity * direction } } // direction is 1 (increase) or -1 (decrease)
//             }
//         }));
//         if (bulkOps.length > 0) {
//              await Product.bulkWrite(bulkOps, session ? { session } : {});
//              console.log(`Backend: Stock adjusted for ${items.length} items. Direction: ${direction}`);
//         }
//     } catch (stockError) {
//          console.error(`Backend: CRITICAL - Error adjusting stock. Direction: ${direction}`, stockError);
//          throw new Error("Failed to update product stock.");
//     }
// };


// // Route for placing an order (Stock decrease logic is INCLUDED, promo logic is REMOVED)
// orderRouter.post("/place", authMiddleware, async (req, res) => {
//     const firebaseUid = req.user?.firebaseUid;
//     // Destructure payload, REMOVED promoCodeApplied
//     const { items, amount, address } = req.body;
//     console.log("Backend: Request to place order.");

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const user = await User.findOne({ firebaseUid }).session(session);
//         if (!user) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ success: false, message: "User not found." }); }

//         // --- Stock Check ---
//         for (const item of items) {
//              const productData = await Product.findById(item._id).session(session);
//              if (!productData || productData.stock < item.quantity) {
//                   await session.abortTransaction(); session.endSession();
//                   return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}.` });
//              }
//         }

//         // --- Create and save the order ---
//         const newOrder = new Order({
//             userId: user._id, items, amount, address, status: "Processing"
//         });
//         await newOrder.save({ session });
//         console.log("Backend: Order saved. ID:", newOrder._id);

//         // --- Decrease Product Stock ---
//         await adjustStock(items, -1, session); // Decrease stock

//         // --- Promo code marking logic REMOVED ---

//         // --- Commit Transaction ---
//         await session.commitTransaction();
//         session.endSession();

//         res.json({ success: true, message: "Order placed successfully!", orderIdMongoDB: newOrder._id });

//     } catch (error) {
//         await session.abortTransaction(); session.endSession();
//         console.error("Backend: Error during place order process:", error);
//         res.status(500).json({ success: false, message: "Error placing order", error: error.message });
//     }
// });

// // --- Get User Orders (Unchanged) ---
// orderRouter.get("/userorders", authMiddleware, async (req, res) => {
//     const firebaseUid = req.user?.firebaseUid;
//     if (!firebaseUid) return res.status(401).json({ success: false, message: "Auth failed." });
//     try {
//         const user = await User.findOne({ firebaseUid });
//         if (!user) return res.status(404).json({ success: false, message: "User not found." });
//         const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
//         res.json({ success: true, data: orders });
//     } catch (error) {
//         console.error("Backend: Error fetching user orders:", error);
//         res.status(500).json({ success: false, message: "Server error fetching orders" });
//     }
//  });

// // --- Admin List Orders (Unchanged) ---
// orderRouter.get("/list", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const orders = await Order.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
//         res.json({ success: true, data: orders });
//     } catch (error) {
//         console.error("Backend: Error fetching all orders:", error);
//         res.status(500).json({ success: false, message: "Error fetching orders" });
//     }
//  });

// // --- Admin Update Order Status (UPDATED to restore stock on cancel) ---
// orderRouter.put("/status", authMiddleware, isAdmin, async (req, res) => {
//     const { orderId, status } = req.body;
//     if (!orderId || !status) return res.status(400).json({ success: false, message: "Missing data." });
//     const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
//     if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: `Invalid status.` });

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const order = await Order.findById(orderId).session(session);
//         if (!order) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ success: false, message: "Order not found." }); }
//         if (order.status === "Delivered" || order.status === "Cancelled") { await session.abortTransaction(); session.endSession(); return res.status(400).json({ success: false, message: `Order already ${order.status}.` }); }

//         // Restore Stock if Status is changed TO Cancelled
//         if (status === "Cancelled" && order.status !== "Cancelled") {
//              console.log(`Backend: Admin cancelling order ${orderId}. Restoring stock...`);
//              await adjustStock(order.items, 1, session); // Increase stock
//         }

//         order.status = status;
//         await order.save({ session });
//         await session.commitTransaction(); session.endSession();
//         res.json({ success: true, message: "Order status updated!", data: order });
//     } catch (error) {
//         await session.abortTransaction(); session.endSession();
//         console.error(`Backend: Error updating status for order ${orderId}:`, error);
//         res.status(500).json({ success: false, message: "Error updating status" });
//     }
// });

// // --- User Cancel Order (UPDATED to restore stock) ---
// orderRouter.put("/cancel/:orderId", authMiddleware, async (req, res) => {
//     const firebaseUid = req.user?.firebaseUid;
//     const orderIdToCancel = req.params.orderId;

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const user = await User.findOne({ firebaseUid }).session(session);
//         if (!user) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ success: false, message: "User not found." }); }
//         const order = await Order.findOne({ _id: orderIdToCancel, userId: user._id }).session(session);
//         if (!order) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ success: false, message: "Order not found/access denied." }); }
//         if (order.status !== 'Processing' && order.status !== 'Payment Pending') {
//              await session.abortTransaction(); session.endSession();
//              return res.status(400).json({ success: false, message: `Cannot cancel. Status: ${order.status}` });
//         }

//         // Restore Stock
//         console.log(`Backend: User cancelling order ${orderIdToCancel}. Restoring stock...`);
//         await adjustStock(order.items, 1, session); // Increase stock

//         order.status = "Cancelled";
//         await order.save({ session });
//         await session.commitTransaction(); session.endSession();
//         res.json({ success: true, message: "Order cancelled.", data: order });
//     } catch (error) {
//         await session.abortTransaction(); session.endSession();
//         console.error(`Backend: Error cancelling order ${orderIdToCancel}:`, error);
//         res.status(500).json({ success: false, message: "Server error cancelling order" });
//     }
// });

// export default orderRouter;

import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import Razorpay from 'razorpay'; // Import Razorpay
import crypto from 'crypto'; // Node.js crypto module for verification
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose for transactions

dotenv.config(); // Ensure env variables are loaded

const orderRouter = express.Router();

// Initialize Razorpay instance
let razorpayInstance;
try {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("Razorpay instance initialized successfully.");
} catch (error) {
    console.error("!!! Failed to initialize Razorpay instance:", error);
    // This is a critical failure, the server shouldn't start
    // process.exit(1); 
}


// Helper function to adjust stock
const adjustStock = async (items, direction, session = null) => {
    try {
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { stock: item.quantity * direction } } // direction 1 or -1
            }
        }));
        if (bulkOps.length > 0) {
             await Product.bulkWrite(bulkOps, session ? { session } : {});
             console.log(`Backend: Stock adjusted for ${items.length} items. Direction: ${direction}`);
        }
    } catch (stockError) {
         console.error(`Backend: CRITICAL - Error adjusting stock. Direction: ${direction}`, stockError);
         throw new Error("Failed to update product stock.");
    }
};


// --- NEW ROUTE: Create Razorpay Order ---
orderRouter.post("/create-razorpay-order", authMiddleware, async (req, res) => {
    const { amount, currency = "INR" } = req.body;
    console.log(`Backend: Request to create Razorpay order for amount: ${amount}`);

    if (!razorpayInstance) {
         return res.status(500).json({ success: false, message: 'Razorpay is not initialized on the server.' });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    try {
        const options = {
            amount: Math.round(amount * 100), // Amount in smallest unit (paisa for INR)
            currency: currency,
            receipt: `receipt_order_${Date.now()}`, // Simple unique receipt ID
        };
        const razorpayOrder = await razorpayInstance.orders.create(options);

        if (!razorpayOrder) {
            console.error("Backend: Razorpay order creation returned null/undefined.");
            return res.status(500).json({ success: false, message: 'Razorpay order creation failed.' });
        }

        console.log("Backend: Razorpay order created:", razorpayOrder.id);
        res.json({
            success: true,
            orderId: razorpayOrder.id, // Razorpay's Order ID
            amount: razorpayOrder.amount, // Amount in paisa
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID // Send key_id back to frontend
        });
    } catch (error) {
        console.error("Backend: Razorpay order creation error:", error);
        res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: error.message });
    }
});
// --- END Create Razorpay Order Route ---

// --- NEW ROUTE: Verify Razorpay Payment ---
orderRouter.post("/verify-payment", authMiddleware, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIdMongoDB } = req.body;
    console.log("Backend: Received request to verify payment:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderIdMongoDB) {
        return res.status(400).json({ success: false, message: "Missing payment verification details." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log("Backend: Payment verified successfully for MongoDB order:", orderIdMongoDB);
            // Payment Verified - Update order status from 'Payment Pending' to 'Processing'
            const updatedOrder = await Order.findByIdAndUpdate(orderIdMongoDB,
               { status: "Processing", payment: true }, // Mark as paid and processing
               { new: true, session }
            );
            if (!updatedOrder) {
                throw new Error("Order not found in DB during verification.");
            }
            
            // Stock was already decreased when /place was called.
            
            await session.commitTransaction();
            session.endSession();
            return res.json({ success: true, message: "Payment verified successfully." });
        } else {
            console.warn("Backend: Payment verification failed for MongoDB order:", orderIdMongoDB);
            // Payment Verification Failed
            await Order.findByIdAndUpdate(orderIdMongoDB, { status: "Payment Failed" }, { session });
            await session.commitTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Payment verification failed (signature mismatch)." });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Backend: Payment verification error:", error);
        res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
    }
});
// --- END Verify Payment Route ---

// MODIFIED Route for placing an order (Save to DB *before* payment initiation)
orderRouter.post("/place", authMiddleware, async (req, res) => {
    const firebaseUid = req.user?.firebaseUid;
    const { items, amount, address } = req.body;
    console.log("Backend: Request to place order (status: Payment Pending).");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findOne({ firebaseUid }).session(session);
        if (!user) { throw new Error("User not found."); }

        // --- Stock Check ---
        for (const item of items) {
             const productData = await Product.findById(item._id).session(session);
             if (!productData || productData.stock < item.quantity) {
                  throw new Error(`Insufficient stock for ${item.name}.`);
             }
        }

        const newOrder = new Order({
            userId: user._id,
            items: items,
            amount: amount,
            address: address,
            status: "Payment Pending" // Start with pending status
        });
        await newOrder.save({ session });
        console.log("Backend: Order saved as Payment Pending. ID:", newOrder._id);

        // --- Decrease Product Stock ---
        await adjustStock(items, -1, session); // Decrease stock

        await session.commitTransaction();
        session.endSession();
        // Return the MongoDB order ID
        res.json({ success: true, message: "Order saved (pending payment).", orderIdMongoDB: newOrder._id });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Backend: Error during place order process:", error);
        res.status(error.message.includes("Insufficient stock") ? 400 : 500)
           .json({ success: false, message: error.message || "Error placing order" });
    }
});

// --- Get User Orders ---
orderRouter.get("/userorders", authMiddleware, async (req, res) => {
    const firebaseUid = req.user?.firebaseUid;
    if (!firebaseUid) return res.status(401).json({ success: false, message: "Auth failed." });
    try {
        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) { res.status(500).json({ success: false, message: "Server error" }); }
 });

// --- Admin List Orders ---
orderRouter.get("/list", authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json({ success: true, data: orders });
    } catch (error) { res.status(500).json({ success: false, message: "Error fetching orders" }); }
 });

// --- Admin Update Order Status ---
orderRouter.put("/status", authMiddleware, isAdmin, async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ success: false, message: "Missing data." });
    
    // Add new statuses to the allowed list
    const allowedStatuses = ["Payment Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Payment Failed"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: `Invalid status.` });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await Order.findById(orderId).session(session);
        if (!order) { /* ... not found ... */ }

        const oldStatus = order.status;
        if (oldStatus === "Delivered" || oldStatus === "Cancelled") {
            return res.status(400).json({ success: false, message: `Order already ${oldStatus}.` });
        }

        // Restore Stock if status changed FROM Processing/Pending TO Cancelled
        if (status === "Cancelled" && (oldStatus === "Processing" || oldStatus === "Payment Pending")) {
             await adjustStock(order.items, 1, session); // Increase stock
        }
        // (Optional: Add logic to DECREASE stock if status changes FROM Cancelled TO Processing)

        order.status = status;
        await order.save({ session });
        await session.commitTransaction(); session.endSession();
        res.json({ success: true, message: "Order status updated!", data: order });
    } catch (error) {
        await session.abortTransaction(); session.endSession();
        console.error(`Backend: Error updating status for order ${orderId}:`, error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
});

// --- User Cancel Order ---
orderRouter.put("/cancel/:orderId", authMiddleware, async (req, res) => {
    const firebaseUid = req.user?.firebaseUid;
    const orderIdToCancel = req.params.orderId;
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findOne({ firebaseUid }).session(session);
        if (!user) { /* ... user not found ... */ }
        const order = await Order.findOne({ _id: orderIdToCancel, userId: user._id }).session(session);
        if (!order) { /* ... order not found ... */ }
        
        // User can only cancel if it's still pending or processing
        if (order.status !== 'Processing' && order.status !== 'Payment Pending') {
             await session.abortTransaction(); session.endSession();
             return res.status(400).json({ success: false, message: `Cannot cancel. Status: ${order.status}` });
        }

        // Restore Stock
        await adjustStock(order.items, 1, session); // Increase stock

        order.status = "Cancelled";
        await order.save({ session });
        await session.commitTransaction(); session.endSession();
        res.json({ success: true, message: "Order cancelled.", data: order });
    } catch (error) {
        await session.abortTransaction(); session.endSession();
        console.error(`Backend: Error cancelling order ${orderIdToCancel}:`, error);
        res.status(500).json({ success: false, message: "Server error cancelling order" });
    }
});

export default orderRouter;

