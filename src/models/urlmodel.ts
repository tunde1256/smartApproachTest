import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    visitCount: { type: Number, default: 0 }
}, { timestamps: true });  

export const Url = mongoose.model("Url", UrlSchema);
