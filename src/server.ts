import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

let server: Server;
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI!;

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongoose connected");

    server = app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Database connection failed:", error);
  }
}

main();
