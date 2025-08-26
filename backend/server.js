// File: backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import helmet from 'helmet';

// Import all route files
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import userRoutes from './routes/users.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import brokerApplicationRoutes from './routes/brokerApplicationRoutes.js';
import brokerRoutes from './routes/brokerRoutes.js'; // NEW: Broker Dashboard routes

// Load environment variables from .env file
dotenv.config();

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();
// --- END OF DATABASE CONNECTION ---

// Configure __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARE SETUP ---

// Enable CORS for all incoming requests first
app.use(cors());

// Security headers with correct cross-origin policy
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Body parsers for JSON and URL-encoded data with a size limit
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// --- END OF MIDDLEWARE ---


// --- API ROUTES ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount all routers
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/broker-applications', brokerApplicationRoutes);
app.use('/api/brokers', brokerRoutes); // NEW: Mount Broker Dashboard routes
// --- END OF ROUTES ---


// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// --- END OF SERVER INITIALIZATION ---