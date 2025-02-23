"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = void 0;
const generateShortCode = () => {
    const length = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < length; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortCode;
};
exports.generateShortCode = generateShortCode;
