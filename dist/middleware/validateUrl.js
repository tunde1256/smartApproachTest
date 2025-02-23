"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShortCode = exports.validateUrl = void 0;
const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/i;
    return regex.test(url);
};
const validateUrl = (req, res, next) => {
    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: "Long URL is required" });
    }
    if (!isValidUrl(longUrl)) {
        return res.status(400).json({ error: "Invalid URL format" });
    }
    next();
};
exports.validateUrl = validateUrl;
const validateShortCode = (req, res, next) => {
    const { shortCode } = req.params;
    if (!shortCode) {
        return res.status(400).json({ error: "Short code is required" });
    }
    if (shortCode.length !== 8) {
        return res.status(400).json({ error: "Short code must be exactly 8 characters" });
    }
    next();
};
exports.validateShortCode = validateShortCode;
