"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.log(`Rate limit exceeded for ${req.ip}: Too many requests`);
        res.status(429).json({
            error: "Too many requests, please try again later.",
            message: `Rate limit exceeded for ${req.ip}`,
            ip: req.ip,
        });
    },
});
exports.default = exports.limiter;
