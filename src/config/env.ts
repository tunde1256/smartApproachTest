import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI ,
    BASE_URL: process.env.BASE_URL || "http://localhost:5000"
};
