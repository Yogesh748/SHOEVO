import admin from 'firebase-admin';
import User from '../models/userModel.js';

// 1. Import Node.js built-in modules to read the JSON file
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Helper to get the correct path to the key file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

// 2. Read the JSON file synchronously and parse it
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const authMiddleware = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ success: false, message: "Authorization required (No token)." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // 3. Attach the Firebase UID directly to req.user for the next middleware/route
        req.user = { firebaseUid: decodedToken.uid }; 

        // Find user in DB (optional here, but useful for isAdmin)
         const user = await User.findOne({ firebaseUid: decodedToken.uid });
         if (user) {
            req.user.role = user.role; // Add role if user found
            req.user.dbInfo = user; // Attach full user DB info if needed later
         } else {
             // Handle case where user exists in Firebase but not DB (e.g., failed registration)
             // Depending on logic, might allow request or deny it
             console.warn(`User with UID ${decodedToken.uid} found in Firebase but not in local DB.`);
             // For now, let's allow the request but note the role might be missing
         }


        next(); 
    } catch (error) {
        console.error("Firebase token verification failed:", error);
        return res.status(401).json({ success: false, message: "Authorization failed (Invalid token)." });
    }
};

const isAdmin = (req, res, next) => {
    // Now check role attached in authMiddleware
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
         // Check if user wasn't found in DB at all during authMiddleware
         if (!req.user || !req.user.role) {
             return res.status(404).json({ success: false, message: "User not fully registered or role missing." });
         }
         // User exists but is not admin
        res.status(403).json({ success: false, message: "Forbidden: Admin access required." });
    }
};

export { authMiddleware, isAdmin };