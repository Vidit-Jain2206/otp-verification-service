import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticate";
import { generateApiKey } from "../controllers/apiKey/generateApiKey";
export const apiKeyRouter = Router();

apiKeyRouter.post("/generate", authenticateJWT, generateApiKey);
