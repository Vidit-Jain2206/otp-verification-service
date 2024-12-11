import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { client } from "../client";
import crypto from "crypto";

export interface AuthenticatedRequest extends Request {
  apiDetails: {
    api_key: string;
    id: string;
    user_id: string;
    created_at: Date;
    revoked_at: Date | null;
    otp_count: number;
    custom_msg: string;
    otp_expiration_time: number;
  };
  apiKey: string;
}

export const authenticateApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const api_key: string = req.headers["api-key"] as string;
    if (!api_key) {
      throw new ApiError("API Key is required", 401);
    }
    const hashedApiKey = crypto
      .createHash("sha256")
      .update(api_key)
      .digest("hex");
    const apiKey = await client.api_key.findFirst({
      where: {
        api_key: hashedApiKey,
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
    req.apiDetails = apiKey;
    req.apiKey = api_key;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
