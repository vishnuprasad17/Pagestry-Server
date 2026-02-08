import mongoose from "mongoose";

export const initializeDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DB_URL;
    if (!mongoURI) {
      throw new Error('MongoDB URL is not defined');
    }
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error}`);
    process.exit(1);
  }
};