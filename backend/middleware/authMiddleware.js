import admin from 'firebase-admin';
import User from '../models/userModel.js';

let serviceAccount;
try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("authMiddleware: Successfully parsed FIREBASE_SERVICE_ACCOUNT from env.");
} catch (error) {
    console.error("!!! authMiddleware: FAILED to parse FIREBASE_SERVICE_ACCOUNT. Check Render env variables.", error.message);

    process.exit(1);
}


if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("authMiddleware: Firebase Admin SDK initialized.");
}


const authMiddleware = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ success: false, message: "Authorization required (No token)." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = { firebaseUid: decodedToken.uid }; 

        
         const user = await User.findOne({ firebaseUid: decodedToken.uid });
         if (user) {
            req.user.role = user.role; 
            req.user.dbInfo = user; 
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