import { Request, Response, NextFunction } from "express";

const isValidUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/i;
        return regex.test(url);
};

export const validateUrl = (req: Request, res: Response, next: NextFunction): any => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "Long URL is required" });
    }

    if (!isValidUrl(longUrl)) {
        return res.status(400).json({ error: "Invalid URL format" });
    }

    next(); 
};

export const validateShortCode = (req: Request, res: Response, next: NextFunction): any => {
    const { shortCode } = req.params;

    if (!shortCode) {
        return res.status(400).json({ error: "Short code is required" });
    }

    if (shortCode.length !== 8) {
        return res.status(400).json({ error: "Short code must be exactly 8 characters" });
    }

    next(); 
};
