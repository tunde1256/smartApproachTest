import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    visitCount: { type: Number, default: 0 }
});

export const Url = mongoose.model("Url", UrlSchema);
