import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use a simple in-memory approach for now, or provide a MongoDB Atlas URI later
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/punjab-disaster-management';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Don't exit process in production - Vercel needs the function to run
    if (process.env.NODE_ENV === 'production') {
      console.log('Continuing without database connection...');
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;