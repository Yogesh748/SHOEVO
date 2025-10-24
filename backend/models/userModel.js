import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseUid: { // The unique ID provided by Firebase Authentication
        type: String,
        required: true,
        unique: true // Ensure each Firebase user has only one entry
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: { // We'll get this during signup
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['customer', 'admin'], // Define possible roles
        default: 'customer' // New users are customers by default
    }
    // 'usedPromoCodes' field is removed
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

const User = mongoose.model("User", userSchema);

export default User;