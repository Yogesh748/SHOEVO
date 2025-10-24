import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // Each code must be unique
        uppercase: true // Store codes in uppercase for case-insensitive validation
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percent', 'fixed', 'shipping'] // Allowed discount types
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0 // Discount value cannot be negative
    },
    description: {
        type: String // Optional description for the admin
    },
    isActive: {
        type: Boolean,
        default: true // Code is active by default
    },
    // --- EXPIRY DATE FIELD ---
    expiryDate: {
        type: Date,
        required: false // Make it optional
    }
    // --- END EXPIRY DATE FIELD ---
}, { timestamps: true }); // Adds createdAt and updatedAt

// Create index for faster code lookup
promoCodeSchema.index({ code: 1 });

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;