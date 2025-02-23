import { Request, Response } from "express";
import { Url } from "../models/urlmodel";
import { generateShortCode } from "../utils/generateShortCode";
import { config } from "../config/env";
import redis from "../config/redis";
import rateLimiter from "../middleware/rateLimiter";  
import { isUrlLive } from "../utils/isUrlLive";

export const shortenUrl = [
    rateLimiter,  
    async (req: Request, res: Response): Promise<any> => {
      const { longUrl } = req.body;
  
      if (!longUrl) {
        return res.status(400).json({ error: "Long URL is required" });
      }
  
      try {
        const liveStatusMessage = await isUrlLive(longUrl);
  
        // Check if the message returned from isUrlLive contains "live and reachable"
        if (!liveStatusMessage.includes("live and reachable")) {
          return res.status(400).json({ error: liveStatusMessage });
        }
  
        const existingShortCode = await redis.get(longUrl);
        if (existingShortCode) {
          const shortUrl = `${config.BASE_URL}/${existingShortCode}`;
          return res.status(201).json({ shortUrl });
        }
  
        const shortCode = generateShortCode();
        const shortUrl = `${config.BASE_URL}/${shortCode}`;
  
        const newUrl = new Url({ longUrl, shortCode });
        await newUrl.save();
  
        await redis.set(longUrl, shortCode, 'EX', 3600);
  
        return res.status(201).json({ shortUrl });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
      }
    }
  ];
  
  
  export const getOriginalUrl = [
    rateLimiter, 
    async (req: Request, res: Response): Promise<any> => {
      const { shortCode } = req.params;
  
      try {
        console.log("Checking Redis cache for:", shortCode);
        const cachedUrl = await redis.get(shortCode);
  
        if (cachedUrl) {
          console.log("Cache hit: Found URL in cache.");
  
          const url = await Url.findOne({ shortCode });
  
          if (url) {
            console.log(`Visit count before increment: ${url.visitCount}`);
            url.visitCount += 1;
            await url.save();
            console.log(`Visit count after increment: ${url.visitCount}`);
  
            await redis.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
            console.log("Updated visit count in Redis.");
          }
  
          return res.redirect(cachedUrl);
        } else {
          console.log("Cache miss. Fetching URL from database...");
          const url = await Url.findOne({ shortCode });
  
          if (!url) {
            return res.status(404).json({ error: "URL not found" });
          }
  
          console.log(`Visit count before increment: ${url.visitCount}`);
          url.visitCount += 1;
          await url.save();
          console.log(`Visit count after increment: ${url.visitCount}`);
  
          await redis.set(shortCode, url.longUrl, "EX", 3600);
          await redis.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
  
          return res.redirect(url.longUrl);
        }
      } catch (error) {
        console.error("Error in getOriginalUrl:", error);
        return res.status(500).json({ error: "Server Error" });
      }
    }
  ];

export const getAnalytics = async (req: Request, res: Response): Promise<any> => {
    const { shortCode } = req.params;

    try {
        let cachedVisitCount = await redis.get(`visitCount:${shortCode}`);
        console.log(`Checking Redis cache for visit count of shortCode: ${shortCode}`);

        if (cachedVisitCount) {
            console.log(`Cache hit: Visit count found in Redis: ${cachedVisitCount}`);
            return res.json({
                shortCode,
                visitCount: cachedVisitCount, 
                message: "Data retrieved from cache",
            });
        }

        console.log(`Cache miss: Fetching visit count from database for shortCode: ${shortCode}`);
        const url = await Url.findOne({ shortCode });

        if (!url) {
            console.log(`URL not found for shortCode: ${shortCode}`);
            return res.status(404).json({ error: "URL not found" });
        }

        console.log(`Visit count in DB before increment: ${url.visitCount}`);
        
        url.visitCount += 1;
        await url.save();
        console.log(`Visit count in DB after increment: ${url.visitCount}`);

        await redis.set(`visitCount:${shortCode}`, url.visitCount.toString(), "EX", 3600);
        console.log(`Updated Redis cache with new visit count: ${url.visitCount}`);

        return res.json({
            shortCode,
            longUrl: url.longUrl,
            visitCount: url.visitCount,
            message: "Data retrieved from database and cached",
        });

    } catch (error) {
        console.error('Error in getAnalytics:', error);
        return res.status(500).json({ error: "Server Error" });
    }
};
