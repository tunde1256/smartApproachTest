"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Create a rate limiter that restricts requests based on IP and time window (1 minute)
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 5, // Max 5 requests per minute per IP
    message: "Too many requests from this IP, please try again later.", // Custom message when rate limit is exceeded
    standardHeaders: true, // Include rate limit info in response headers
    legacyHeaders: false, // Disable legacy `X-RateLimit-*` headers
    // Custom handler when the rate limit is exceeded
    handler: (req, res) => {
        // Log when the rate limit is exceeded
        console.log(`Rate limit exceeded for ${req.ip}: Too many requests`);
        // Send a custom response with the status 429 (Too Many Requests)
        res.status(429).json({
            error: "Too many requests, please try again later.",
            message: `Rate limit exceeded for ${req.ip}`,
            ip: req.ip, // Include IP address in the response for debugging purposes
        });
    },
});
exports.default = exports.limiter;
