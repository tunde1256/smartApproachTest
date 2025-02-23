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
exports.isUrlLive = void 0;
const axios_1 = __importDefault(require("axios"));
const isUrlLive = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, { timeout: 5000 });
        if (response.status === 200) {
            return 'The URL is live and reachable.';
        }
        else {
            return `The URL responded with status code: ${response.status}. It might not be reachable.`;
        }
    }
    catch (error) {
        if (error.response) {
            return `The URL responded with status code: ${error.response.status}. It might not be reachable.`;
        }
        else if (error.request) {
            return 'No response received from the URL. It might be down or unreachable.';
        }
        else {
            return `Error occurred while trying to reach the URL: ${error.message}`;
        }
    }
});
exports.isUrlLive = isUrlLive;
