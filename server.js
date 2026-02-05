const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/", require("./routes/urlRoutes"));

// MongoDB connection (cached for serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

connectDB();

// ❌ DO NOT use app.listen() on Vercel
module.exports = app;
