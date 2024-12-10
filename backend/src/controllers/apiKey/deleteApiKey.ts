import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticateJWT";
import { client } from "../../client";
import { ApiError } from "../../utils/ApiError";
import crypto from "crypto";
export const deleteApiKey = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError("Unauthorized Access", 403);
    }
    const { apiId } = req.params;
    if (!apiId) {
      throw new ApiError("ApiId is required", 400);
    }
    const userExists = await client.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      throw new Error("User not found");
    }

    const hashedApiKey = crypto
      .createHash("sha256")
      .update(apiId)
      .digest("hex");

    const apiKey = await client.api_key.findFirst({
      where: {
        api_key: hashedApiKey,
      },
    });
    if (!apiKey) {
      throw new ApiError("ApiId is invalid", 403);
    }
    if (apiKey?.revoked_at) {
      throw new ApiError("Api Key has already been revoked", 403);
    }
    const isDeleted = await client.api_key.update({
      where: {
        id: apiKey.id,
      },
      data: {
        revoked_at: new Date(),
      },
    });
    if (!isDeleted) {
      throw new ApiError("Failed to revoke Api Key", 500);
    }
    res.status(200).json({
      apiKey: hashedApiKey,
      message: "Api Key has been revoked successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
