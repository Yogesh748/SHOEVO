//import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import productRouter from './routes/productRoute.js';
// import userRouter from './routes/userRoute.js';
// import orderRouter from './routes/orderRoute.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 4000;
// const dbConnectString = process.env.MONGO_URI;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // DB Connection
// const connectDB = async () => {
//     try {
//         console.log("Attempting MongoDB connection...");
//         // --- ADD CONNECTION OPTIONS HERE ---
//         await mongoose.connect(dbConnectString, {
//             serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds for server selection
//             socketTimeoutMS: 45000, // Wait up to 45 seconds for socket operations
//         });
//         // --- END OPTIONS ---
//         console.log("MongoDB connected successfully!");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         // Provide more details if available
//         console.error("Error details:", error.reason || 'No specific reason provided');
//         process.exit(1);
//     }
// };
// connectDB();

// // API Endpoints
// app.get("/", (req, res) => { res.send("API is Working"); });
// app.use("/api/product", productRouter);
// app.use("/api/user", userRouter);
// app.use("/api/order", orderRouter);

// // Serve images
// app.use('/images', express.static(path.join(__dirname, 'uploads')));

// // Listener
// app.listen(port, () => {
//     console.log(`Server started on http://localhost:${port}`);
// });

// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import productRouter from './routes/productRoute.js';
// import userRouter from './routes/userRoute.js';
// import orderRouter from './routes/orderRoute.js';
// // --- VERIFY THIS IMPORT PATH ---
// // If promoRoute.js is directly inside 'routes', this is correct.
// // If you put it in a subfolder like 'routes/promo', change accordingly.
// import promoRouter from './routes/promoRoute.js';
// // --- END VERIFY ---
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 4000;
// const dbConnectString = process.env.MONGO_URI;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // DB Connection
// const connectDB = async () => {
//     try { await mongoose.connect(dbConnectString, { serverSelectionTimeoutMS: 30000 }); console.log("MongoDB connected!"); }
//     catch (error) { console.error("MongoDB connection error:", error); process.exit(1); }
// };
// connectDB();

// // API Endpoints
// app.get("/", (req, res) => { res.send("API is Working"); });
// app.use("/api/product", productRouter);
// app.use("/api/user", userRouter);
// app.use("/api/order", orderRouter);
// // --- VERIFY THIS MOUNTING POINT ---
// // This tells Express that any URL starting with /api/promo should use promoRouter
// app.use("/api/promo", promoRouter);
// // --- END VERIFY ---

// // Serve images
// app.use('/images', express.static(path.join(__dirname, 'uploads')));

// // Listener
// app.listen(port, () => {
//     console.log(`Server started on http://localhost:${port}`);
// });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import promoRouter from './routes/promoRoute.js';
import path from 'path'; // Keep for other potential uses, though not for images
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const dbConnectString = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(dbConnectString, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
connectDB();

// API Endpoints
app.get("/", (req, res) => { res.send("API is Working"); });
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);

// --- REMOVED ---
// We no longer serve images from the 'uploads' folder
// app.use('/images', express.static(path.join(__dirname, 'uploads')));
// --- END REMOVED ---

// Listener
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});