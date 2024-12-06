import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { client } from "../client";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const api_key: string = req.headers["api-key"] as string;
    if (!api_key) {
      throw new ApiError("API Key is required", 401);
    }
    const apiKey = await client.api_key.findFirst({
      where: {
        api_key: api_key,
      },
    });
    if (!apiKey) {
      throw new ApiError("Invalid API Key", 401);
    }
    const now = Date.now();
    const revokedTime = apiKey.revoked_at;
    if (revokedTime && revokedTime.getTime() < now) {
      throw new ApiError("API Key has been revoked", 401);
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
