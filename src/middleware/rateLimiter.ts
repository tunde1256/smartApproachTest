import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000,  
  max: 5,                  
  message: "Too many requests from this IP, please try again later.",  
  standardHeaders: true,    
  legacyHeaders: false,     
  
  handler: (req, res) => {
    console.log(`Rate limit exceeded for ${req.ip}: Too many requests`);
    
    res.status(429).json({
      error: "Too many requests, please try again later.",
      message: `Rate limit exceeded for ${req.ip}`,
      ip: req.ip, 
    });
  },
});


export default limiter;