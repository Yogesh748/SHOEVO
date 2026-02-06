import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: { 
        type: Array, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    address: { 
        type: Object, 
        required: true 
    },
    status: { 
        type: String, 
        default: "Processing" 
    },
    date: { 
        type: Date, 
        default: Date.now() 
    },
   
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;

