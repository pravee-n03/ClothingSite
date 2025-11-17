import mongoose from "mongoose";

// Global cache for connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = (handler) => async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return res.status(500).json({ message: 'Database configuration error: MONGODB_URI is not set' });
    }

    // Use cached connection if available
    if (cached.conn) {
      return await handler(req, res);
    }

    // If no cached connection, create a new one
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        useUnifiedTopology: true,
        useNewUrlParser: true,
      };

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return await handler(req, res);
  } catch (err) {
    console.error("DATABASE CONNECTION FAILED:", err.message);
    console.error("Full error:", err);
    cached.promise = null; // Reset promise on error
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Database connection failed: ' + err.message });
    }
  }
};

export default connectDB;
