import admin from 'firebase-admin';
import User from '../models/userModel.js';

// 1. REMOVE the 'fs', 'path', and 'fileURLToPath' imports. We don't need them.

// 2. READ the service account JSON from the environment variable we just created
// We must parse the string from the .env variable back into a JSON object
let serviceAccount;
try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("authMiddleware: Successfully parsed FIREBASE_SERVICE_ACCOUNT from env.");
} catch (error) {
    console.error("!!! authMiddleware: FAILED to parse FIREBASE_SERVICE_ACCOUNT. Check Render env variables.", error.message);
    // If this fails, the app can't authenticate anyone. We should exit.
    process.exit(1);
}

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("authMiddleware: Firebase Admin SDK initialized.");
}

// 3. The rest of the middleware logic is the same as before

const authMiddleware = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ success: false, message: "Authorization required (No token)." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = { firebaseUid: decodedToken.uid }; // Attach firebaseUid

        // Find user in our DB to get their role
         const user = await User.findOne({ firebaseUid: decodedToken.uid });
         if (user) {
            req.user.role = user.role; // Add role
            req.user.dbInfo = user; // Attach full user DB info
         } else {
             console.warn(`User with UID ${decodedToken.uid} found in Firebase but not in local DB.`);
         }

        next(); 
    } catch (error) {
        console.error("Firebase token verification failed:", error);
        return res.status(401).json({ success: false, message: "Authorization failed (Invalid/Expired token)." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
         if (!req.user || !req.user.role) {
             return res.status(404).json({ success: false, message: "User not fully registered or role missing." });
         }
        res.status(403).json({ success: false, message: "Forbidden: Admin access required." });
    }
};

export { authMiddleware, isAdmin };