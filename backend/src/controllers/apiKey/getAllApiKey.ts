import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticateJWT";
import { client } from "../../client";
import { ApiError } from "../../utils/ApiError";

export const getAllApiKey = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError("Unauthorized Access", 403);
    }
    const userExists = await client.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      throw new Error("User not found");
    }
    const apiKeys = await client.api_key.findMany({
      where: {
        user_id: userExists.id,
        revoked_at: null,
      },
    });
    if (apiKeys.length < 0) {
      throw new ApiError(`Could not find apikeys for this user`, 500);
    }

    res.status(200).json({
      apiKeys: apiKeys,
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
