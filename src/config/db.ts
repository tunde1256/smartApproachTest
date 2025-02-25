import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const MAX_RETRIES = 5; 
const RETRY_DELAY = 5000;  

export const connectDB = async (retries: number = 0) => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        
        if (retries < MAX_RETRIES) {
            console.log(`Retrying connection attempt #${retries + 1}...`);
            setTimeout(() => connectDB(retries + 1), RETRY_DELAY);  
        } else {
            console.error("Max retries reached. Exiting application.");
            process.exit(1);
        }
    }
};
