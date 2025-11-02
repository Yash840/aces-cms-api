import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};