import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticateJWT";
import { client } from "../../client";
import { ApiError } from "../../utils/ApiError";
import crypto from "crypto";
import { encode } from "../../helpers/encode";

export const generateApiKey = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    const { custom_msg, otp_expiration_time } = req.body;
    if (!custom_msg || !otp_expiration_time) {
      throw new ApiError("Missing required fields", 400);
    }
    if (!user) {
      throw new ApiError("Unauthorized Access", 403);
    }
    const userExists = await client.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      throw new ApiError("User not found", 400);
    }
    const apiKeyCount = await client.api_key.findMany({
      where: {
        user_id: userExists.id,
        revoked_at: null,
      },
    });
    const maxCount: number = Number(process.env.MAX_API_KEYS_PER_USER);
    if (apiKeyCount.length >= maxCount) {
      throw new ApiError("Maximum API keys reached", 400);
    }
    const api_key_length = Number(process.env.API_KEY_LENGTH);
    const rawApiKey = crypto.randomBytes(api_key_length).toString("hex");
    // const hashedApiKey = await encode(rawApiKey);

    const apiKey = await client.api_key.create({
      data: {
        user_id: userExists.id,
        api_key: rawApiKey,
        custom_msg,
        otp_expiration_time,
        revoked_at: null,
      },
    });
    if (!apiKey) {
      throw new ApiError("Failed to generate API key", 500);
    }
    res.status(200).json({
      apiKey: rawApiKey,
      message: "Api Key generated successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
