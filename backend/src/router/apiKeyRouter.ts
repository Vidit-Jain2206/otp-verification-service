import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticate";
import { generateApiKey } from "../controllers/apiKey/generateApiKey";
import { deleteApiKey } from "../controllers/apiKey/deleteApiKey";
import { getAllApiKey } from "../controllers/apiKey/getAllApiKey";
export const apiKeyRouter = Router();

apiKeyRouter.post("/generate", authenticateJWT, generateApiKey);
apiKeyRouter.get("/", authenticateJWT, getAllApiKey);
apiKeyRouter.delete("/:apiId", authenticateJWT, deleteApiKey);
