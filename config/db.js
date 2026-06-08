const mongoose = require('mongoose');

// Cache the connection promise for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return cached connection if available (critical for serverless cold starts)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`\x1b[32m[Database] MongoDB Connected\x1b[0m`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`\x1b[31m[Database] Connection Error: ${error.message}\x1b[0m`);
    // DO NOT call process.exit() — would kill serverless function
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
