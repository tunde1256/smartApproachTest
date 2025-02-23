import { Router } from "express";
import { shortenUrl, getOriginalUrl, getAnalytics } from "../controllers/urlcontroller";
import { validateUrl } from "../middleware/validateUrl";

const router = Router();

router.post("/shorten", validateUrl, shortenUrl); 

router.get("/:shortCode", getOriginalUrl);  
router.get("/analytics/:shortCode", getAnalytics);

export default router;
