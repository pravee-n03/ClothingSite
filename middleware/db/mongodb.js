import mongoose from "mongoose";


const connectDB = (handler) => async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return res.status(500).json({ message: 'Database configuration error: MONGODB_URI is not set' });
    }

    // Check if mongoose is already connected
    if (mongoose.connections[0].readyState === 1) {
      // Use existing connection
      return await handler(req, res);
    }

    // Create new connection
    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    
    return await handler(req, res);
  } catch (err) {
    console.error("DATABASE CONNECTION FAILED:", err.message);
    console.error("Full error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Database connection failed: ' + err.message });
    }
  }
};

export default connectDB;
