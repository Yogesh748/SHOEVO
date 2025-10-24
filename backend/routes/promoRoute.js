// import express from 'express';
// import PromoCode from '../models/promoCodeModel.js'; // Ensure path is correct relative to this file
// import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js'; // Ensure path is correct

// const promoRouter = express.Router();

// // --- ADMIN ROUTES ---

// // GET /api/promo/list - List all promo codes (Admin only)
// promoRouter.get("/list", authMiddleware, isAdmin, async (req, res) => {
//     console.log("Backend: GET /api/promo/list request (Admin).");
//     try {
//         const codes = await PromoCode.find({}).sort({ createdAt: -1 });
//         res.json({ success: true, data: codes });
//     } catch (error) {
//         console.error("Backend: Error fetching promo codes:", error);
//         res.status(500).json({ success: false, message: "Error fetching promo codes" });
//     }
// });

// // POST /api/promo/add - Add a new promo code (Admin only)
// promoRouter.post("/add", authMiddleware, isAdmin, async (req, res) => {
//     const { code, discountType, discountValue, description, expiryDate } = req.body;
//     console.log("Backend: POST /api/promo/add request (Admin). Body:", req.body);

//     if (!code || !discountType || discountValue == null) return res.status(400).json({ success: false, message: "Code, type, value required." });
//     if (Number(discountValue) < 0) return res.status(400).json({ success: false, message: "Value cannot be negative." });

//     try {
//         const upperCaseCode = code.toUpperCase().trim();
//         const existingCode = await PromoCode.findOne({ code: upperCaseCode });
//         if (existingCode) return res.status(400).json({ success: false, message: "Code exists." });

//         const newPromoData = {
//             code: upperCaseCode, discountType, discountValue: Number(discountValue),
//             description: description || '',
//             ...(expiryDate && !isNaN(new Date(expiryDate)) && { expiryDate: new Date(expiryDate) })
//         };
//         const newPromoCode = new PromoCode(newPromoData);
//         await newPromoCode.save();
//         console.log("Backend: Promo code added:", newPromoCode.code);
//         res.status(201).json({ success: true, message: "Promo code added!", data: newPromoCode });

//     } catch (error) {
//         console.error("Backend: Error adding promo code:", error);
//         if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
//         res.status(500).json({ success: false, message: "Server error adding promo code" });
//     }
// });

// // DELETE /api/promo/remove/:id - Remove a promo code (Admin only)
// promoRouter.delete("/remove/:id", authMiddleware, isAdmin, async (req, res) => {
//     const promoId = req.params.id;
//     console.log(`Backend: DELETE /api/promo/remove/${promoId} request (Admin).`);
//     try {
//         const deletedCode = await PromoCode.findByIdAndDelete(promoId);
//         if (!deletedCode) return res.status(404).json({ success: false, message: "Promo code not found." });
//         console.log("Backend: Promo code removed:", deletedCode.code);
//         res.json({ success: true, message: "Promo code removed successfully!" });
//     } catch (error) {
//         console.error(`Backend: Error removing promo code ${promoId}:`, error);
//         if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid ID format." });
//         res.status(500).json({ success: false, message: "Server error removing promo code" });
//     }
// });

// // --- CUSTOMER ROUTE ---

// // POST /api/promo/validate - Validate a promo code
// promoRouter.post("/validate", async (req, res) => {
//     const { code } = req.body;
//     console.log(`Backend: Validating promo code from cart: ${code}`);
//     if (!code) return res.status(400).json({ success: false, message: "Promo code is required." });
//     const normalizedCode = code.toUpperCase().trim();
//     try {
//         const promoDetails = await PromoCode.findOne({
//             code: normalizedCode, isActive: true,
//             $or: [ { expiryDate: { $exists: false } }, { expiryDate: { $gte: new Date() } } ]
//         });
//         if (promoDetails) {
//             console.log(`Backend: Promo code ${normalizedCode} is valid.`);
//             res.json({ success: true, message: "Promo code applied!", discount: { type: promoDetails.discountType, value: promoDetails.discountValue } });
//         } else {
//             console.log(`Backend: Promo code ${normalizedCode} is invalid/inactive/expired.`);
//             res.status(404).json({ success: false, message: "Invalid, inactive, or expired promo code." });
//         }
//     } catch (error) {
//          console.error(`Backend: Error validating promo code ${normalizedCode}:`, error);
//          res.status(500).json({ success: false, message: "Server error validating promo code" });
//     }
// });

// export default promoRouter;

import express from 'express';
import PromoCode from '../models/promoCodeModel.js'; // Ensure path is correct relative to this file
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js'; // Ensure path is correct

const promoRouter = express.Router();

// --- ADMIN ROUTES ---

// GET /api/promo/list - List all promo codes (Admin only)
promoRouter.get("/list", authMiddleware, isAdmin, async (req, res) => {
    console.log("Backend: GET /api/promo/list request (Admin).");
    try {
        const codes = await PromoCode.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: codes });
    } catch (error) {
        console.error("Backend: Error fetching promo codes:", error);
        res.status(500).json({ success: false, message: "Error fetching promo codes" });
    }
});

// POST /api/promo/add - Add a new promo code (Admin only)
promoRouter.post("/add", authMiddleware, isAdmin, async (req, res) => {
    const { code, discountType, discountValue, description, expiryDate } = req.body;
    console.log("Backend: POST /api/promo/add request (Admin). Body:", req.body);

    if (!code || !discountType || discountValue == null) return res.status(400).json({ success: false, message: "Code, type, value required." });
    if (Number(discountValue) < 0) return res.status(400).json({ success: false, message: "Value cannot be negative." });

    try {
        const upperCaseCode = code.toUpperCase().trim();
        const existingCode = await PromoCode.findOne({ code: upperCaseCode });
        if (existingCode) return res.status(400).json({ success: false, message: "Code exists." });

        const newPromoData = {
            code: upperCaseCode, discountType, discountValue: Number(discountValue),
            description: description || '',
            ...(expiryDate && !isNaN(new Date(expiryDate)) && { expiryDate: new Date(expiryDate) })
        };
        const newPromoCode = new PromoCode(newPromoData);
        await newPromoCode.save();
        console.log("Backend: Promo code added:", newPromoCode.code);
        res.status(201).json({ success: true, message: "Promo code added!", data: newPromoCode });

    } catch (error) {
        console.error("Backend: Error adding promo code:", error);
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
        res.status(500).json({ success: false, message: "Server error adding promo code" });
    }
});

// DELETE /api/promo/remove/:id - Remove a promo code (Admin only)
promoRouter.delete("/remove/:id", authMiddleware, isAdmin, async (req, res) => {
    const promoId = req.params.id;
    console.log(`Backend: DELETE /api/promo/remove/${promoId} request (Admin).`);
    try {
        const deletedCode = await PromoCode.findByIdAndDelete(promoId);
        if (!deletedCode) return res.status(404).json({ success: false, message: "Promo code not found." });
        console.log("Backend: Promo code removed:", deletedCode.code);
        res.json({ success: true, message: "Promo code removed successfully!" });
    } catch (error) {
        console.error(`Backend: Error removing promo code ${promoId}:`, error);
        if (error.kind === 'ObjectId') return res.status(400).json({ success: false, message: "Invalid ID format." });
        res.status(500).json({ success: false, message: "Server error removing promo code" });
    }
});

// --- CUSTOMER ROUTE ---

// POST /api/promo/validate - Validate a promo code
promoRouter.post("/validate", async (req, res) => {
    const { code } = req.body;
    console.log(`Backend: Validating promo code from cart: ${code}`);
    if (!code) return res.status(400).json({ success: false, message: "Promo code is required." });
    const normalizedCode = code.toUpperCase().trim();
    try {
        const promoDetails = await PromoCode.findOne({
            code: normalizedCode, isActive: true,
            $or: [ { expiryDate: { $exists: false } }, { expiryDate: { $gte: new Date() } } ]
        });
        if (promoDetails) {
            console.log(`Backend: Promo code ${normalizedCode} is valid.`);
            res.json({ success: true, message: "Promo code applied!", discount: { type: promoDetails.discountType, value: promoDetails.discountValue } });
        } else {
            console.log(`Backend: Promo code ${normalizedCode} is invalid/inactive/expired.`);
            res.status(404).json({ success: false, message: "Invalid, inactive, or expired promo code." });
        }
    } catch (error) {
         console.error(`Backend: Error validating promo code ${normalizedCode}:`, error);
         res.status(500).json({ success: false, message: "Server error validating promo code" });
    }
});

export default promoRouter;

