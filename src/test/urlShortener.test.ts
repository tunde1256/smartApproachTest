import request from "supertest";
import app from "../app";
import { Url } from "../models/urlmodel";
import mongoose from "mongoose";
import redis from "../config/redis";

jest.mock("../config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

const mongoUri =process.env.MONGO_URI as string; 

beforeAll(async () => {
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Url.deleteMany({});
});

describe("URL Shortener API", () => {

  it("should shorten a URL", async () => {
    const res = await request(app)
      .post("/shorten")
      .send({
        longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("shortUrl");
    expect(res.body.shortUrl).toMatch(/^http:\/\/localhost:5001\//); // Update port to 5001
  });

  it("should redirect to the original URL", async () => {
    const shortCode = "x4XRCg";
    await Url.create({
      longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
      shortCode: shortCode,
    });

    const res = await request(app).get(`/${shortCode}`);
    expect(res.status).toBe(302);
    expect(res.header.location).toBe("https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf");
  });

  it("should return 404 for an invalid short code", async () => {
    const res = await request(app).get("/invalidCode");
    expect(res.status).toBe(404);
  });

  it("should return analytics for a valid short code", async () => {
    const shortCode = "x4XRCg";
    await Url.create({
      longUrl: "https://www.ilovepdf.com/download/mnqxwf97gxp4dp86v1gnkr1r387rcs1z9blj254cdv2nsc17l6A8sA29vsddgjddxzlrwlv686bbb5w74cnfAwjts7hAgqlkhpft005pv8cgtz2pr7x8l65t0xd6sd9lwmpdAntk9n6y0bm9c51psxxp2l6m6lmy38002zwrtm3tntc7t3qq/56o-cf",
      shortCode: shortCode,
    });

    const res = await request(app).get(`/analytics/${shortCode}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("shortCode", shortCode);
    expect(res.body).toHaveProperty("visitCount"); 
  });

  it("should return 404 for analytics with invalid short code", async () => {
    const res = await request(app).get("/analytics/invalidCode");
    expect(res.status).toBe(404);
  });
});
