import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    isConnected = true;
    console.log("Connected to Order DB successfully");
  } catch (error) {
    console.log("Error connecting to Order DB", error);
    throw error;
  }
};
