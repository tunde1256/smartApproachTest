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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const urlmodel_1 = require("../models/urlmodel");
const mongoose_1 = __importDefault(require("mongoose"));
jest.mock("../config/redis", () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
}));
const mongoUri = process.env.MONGO_URI;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(mongoUri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield urlmodel_1.Url.deleteMany({});
}));
describe("URL Shortener API", () => {
    it("should shorten a URL", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/shorten")
            .send({
            longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("shortUrl");
        expect(res.body.shortUrl).toMatch(/^http:\/\/localhost:5001\//); // Update port to 5001
    }));
    it("should redirect to the original URL", () => __awaiter(void 0, void 0, void 0, function* () {
        const shortCode = "x4XRCg";
        yield urlmodel_1.Url.create({
            longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
            shortCode: shortCode,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get(`/${shortCode}`);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe("https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf");
    }));
    it("should return 404 for an invalid short code", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/invalidCode");
        expect(res.status).toBe(404);
    }));
    it("should return analytics for a valid short code", () => __awaiter(void 0, void 0, void 0, function* () {
        const shortCode = "x4XRCg";
        yield urlmodel_1.Url.create({
            longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
            shortCode: shortCode,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get(`/analytics/${shortCode}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("shortCode", shortCode);
        expect(res.body).toHaveProperty("visitCount");
    }));
    it("should return 404 for analytics with invalid short code", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/analytics/invalidCode");
        expect(res.status).toBe(404);
    }));
});
