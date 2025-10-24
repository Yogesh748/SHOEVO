import express from 'express';
import User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Import authMiddleware

const userRouter = express.Router();

// Route to register a user in MongoDB after successful Firebase signup
userRouter.post("/register", authMiddleware, async (req, res) => {
    const { name, email } = req.body;
    const firebaseUid = req.user?.firebaseUid;

    if (!firebaseUid) {
         return res.status(401).json({ success: false, message: "Firebase UID not found after token verification." });
    }

    try {
        const existingUser = await User.findOne({ firebaseUid });
        if (existingUser) {
            return res.json({ success: true, message: "User already registered in DB." });
        }

        const newUser = new User({
            firebaseUid: firebaseUid,
            name: name,
            email: email,
        });

        await newUser.save();
        res.json({ success: true, message: "User registered in DB successfully!" });

    } catch (error) {
        console.error("Error registering user in DB:", error);
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: "Email already exists in DB." });
        }
        res.status(500).json({ success: false, message: "Error registering user in DB" });
    }
});

// --- NEW ROUTE ---
// Route to get the user's role based on their token
// We apply authMiddleware to verify the token and find the user in our DB
userRouter.get("/getrole", authMiddleware, async (req, res) => {
    // authMiddleware already verified the token and attached MongoDB user info to req.user.dbInfo
    const user = req.user?.dbInfo;

    if (user) {
        // User found in our database, return their role
        res.json({ success: true, role: user.role });
    } else {
        // User exists in Firebase but somehow not in our DB (should be rare after registration)
        res.status(404).json({ success: false, message: "User record not found in database." });
    }
});
// --- END OF NEW ROUTE ---

export default userRouter;