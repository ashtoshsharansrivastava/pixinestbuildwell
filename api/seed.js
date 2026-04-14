// backend/seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js'; // Your Property model
import User from './models/User.js';         // Your User model
import { properties } from './data/properties.js'; // Your new data file

// Load environment variables from .env file
dotenv.config();

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // 1. Clear existing properties
    await Property.deleteMany();
    console.log('🧹 Existing properties deleted.');

    // 2. Find a user to assign as the agent
    // Your `Property` model requires an `agent` field.
    // We'll find the first user in the database to act as the agent.
    const agentUser = await User.findOne();

    if (!agentUser) {
      console.error('❌ Error: No users found in the database. Please create a user first.');
      process.exit(1);
    }
    
    console.log(`👤 Using user "${agentUser.fullName}" as the agent for all properties.`);

    // 3. Add the agent's ID to each property
    const propertiesWithAgent = properties.map(property => {
      return { ...property, agent: agentUser._id };
    });

    // 4. Insert the new data into the database
    await Property.insertMany(propertiesWithAgent);

    console.log('🌱 Data successfully imported!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

// Main function to run the seeder
const run = async () => {
  await connectDB();
  await importData();
};

run();