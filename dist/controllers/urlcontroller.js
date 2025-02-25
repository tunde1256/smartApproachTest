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
exports.getAnalytics = exports.getOriginalUrl = exports.shortenUrl = void 0;
const urlmodel_1 = require("../models/urlmodel");
const generateShortCode_1 = require("../utils/generateShortCode");
const env_1 = require("../config/env");
const redis_1 = __importDefault(require("../config/redis"));
const rateLimiter_1 = __importDefault(require("../middleware/rateLimiter"));
const isUrlLive_1 = require("../utils/isUrlLive");
exports.shortenUrl = [
    rateLimiter_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { longUrl } = req.body;
        if (!longUrl) {
            return res.status(400).json({ error: "Long URL is required" });
        }
        try {
            const liveStatusMessage = yield (0, isUrlLive_1.isUrlLive)(longUrl);
            if (!liveStatusMessage.includes("live and reachable")) {
                return res.status(400).json({ error: liveStatusMessage });
            }
            const existingUrl = yield urlmodel_1.Url.findOne({ longUrl });
            if (existingUrl) {
                const shortUrl = `${env_1.config.BASE_URL}/${existingUrl.shortCode}`;
                return res.status(201).json({ shortUrl });
            }
            let shortCode = (0, generateShortCode_1.generateShortCode)();
            let urlExists = yield urlmodel_1.Url.findOne({ shortCode });
            while (urlExists) {
                shortCode = (0, generateShortCode_1.generateShortCode)();
                urlExists = yield urlmodel_1.Url.findOne({ shortCode });
            }
            const shortUrl = `${env_1.config.BASE_URL}/${shortCode}`;
            const newUrl = new urlmodel_1.Url({ longUrl, shortCode, visitCount: 0 });
            yield newUrl.save();
            return res.status(201).json({ shortUrl });
        }
        catch (error) {
            console.error('Error during URL shortening:', error);
            return res.status(500).json({ error: "Server Error" });
        }
    })
];
exports.getOriginalUrl = [
    rateLimiter_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { shortCode } = req.params;
        try {
            console.log("Checking Redis cache for:", shortCode);
            const cachedUrl = yield redis_1.default.get(shortCode);
            if (cachedUrl) {
                console.log("Cache hit: Found URL in cache.");
                const url = yield urlmodel_1.Url.findOne({ shortCode });
                if (url) {
                    console.log(`Visit count before increment: ${url.visitCount}`);
                    url.visitCount += 1;
                    yield url.save();
                    console.log(`Visit count after increment: ${url.visitCount}`);
                    yield redis_1.default.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
                    console.log("Updated visit count in Redis.");
                }
                return res.redirect(cachedUrl);
            }
            else {
                console.log("Cache miss. Fetching URL from database...");
                const url = yield urlmodel_1.Url.findOne({ shortCode });
                if (!url) {
                    return res.status(404).json({ error: "URL not found" });
                }
                console.log(`Visit count before increment: ${url.visitCount}`);
                url.visitCount += 1;
                yield url.save();
                console.log(`Visit count after increment: ${url.visitCount}`);
                yield redis_1.default.set(shortCode, url.longUrl, "EX", 3600);
                yield redis_1.default.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
                return res.redirect(url.longUrl);
            }
        }
        catch (error) {
            console.error("Error in getOriginalUrl:", error);
            return res.status(500).json({ error: "Server Error" });
        }
    })
];
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortCode } = req.params;
    try {
        let cachedVisitCount = yield redis_1.default.get(`visitCount:${shortCode}`);
        if (cachedVisitCount) {
            const url = yield urlmodel_1.Url.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({ error: "URL not found" });
            }
            return res.json({
                shortCode,
                visitCount: cachedVisitCount,
                message: "Data retrieved from cache",
                longUrl: url.longUrl,
            });
        }
        const url = yield urlmodel_1.Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }
        yield url.save();
        yield redis_1.default.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
        return res.json({
            shortCode,
            longUrl: url.longUrl,
            visitCount: url.visitCount,
            message: "Data retrieved from database and cached",
        });
    }
    catch (error) {
        console.error('Error in getAnalytics:', error);
        return res.status(500).json({ error: "Server Error" });
    }
});
exports.getAnalytics = getAnalytics;
