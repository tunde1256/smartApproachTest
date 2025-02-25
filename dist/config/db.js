"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 0) {
    try {
        yield mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB Connection Failed", error);
        if (retries < MAX_RETRIES) {
            console.log(`Retrying connection attempt #${retries + 1}...`);
            setTimeout(() => (0, exports.connectDB)(retries + 1), RETRY_DELAY);
        }
        else {
            console.error("Max retries reached. Exiting application.");
            process.exit(1);
        }
    }
});
exports.connectDB = connectDB;
