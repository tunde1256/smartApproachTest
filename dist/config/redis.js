"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
// Initialize Redis client
const redis = new ioredis_1.default({
    host: "localhost", // Redis server address (adjust if using a cloud provider)
    port: 6379, // Redis server port
    // You can also add password or other configuration options if needed
});
exports.default = redis;
