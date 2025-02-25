"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = void 0;
const crypto = __importStar(require("crypto"));
let counter = 0;
const generateShortCode = () => {
    const length = 6;
    const randomBytes = crypto.randomBytes(8);
    const randomPart = randomBytes.toString('base64').replace(/[^A-Za-z0-9]/g, '');
    const counterPart = (counter += 2).toString();
    const combined = counterPart + randomPart;
    let shortCode = Buffer.from(combined).toString('base64').replace(/[^A-Za-z0-9]/g, '');
    shortCode = shortCode.substring(0, length);
    while (shortCode.length < length) {
        shortCode += 'A';
    }
    return shortCode;
};
exports.generateShortCode = generateShortCode;
// import { v4 as uuidv4 } from 'uuid';
// export const generateShortCode = (): string => {
//     const uuid = uuidv4(); 
//     const shortCode = uuid.replace(/[^A-Za-z0-9]/g, '').substring(0, 6); 
//     return shortCode;
// };
