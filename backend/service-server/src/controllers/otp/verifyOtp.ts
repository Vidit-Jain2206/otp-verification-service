import { Request, Response } from "express";
import { client } from "../../client";
import { decode } from "../../helpers/encode";
import { ApiError } from "../../utils/ApiError";
import crypto from "crypto";
import { verifyOtpInRedis } from "../../redis";
import { AuthenticatedRequest } from "../../middleware/authenticateApiKey";
// 1. accepts the otp, verificationKey
// 2. verify the verificationKey :- check phone number
// 3. verify the otp with expiration time :- if expired return expired and remove the entry from database
// if already verified:- return already verified
// 4. if verified: remove the entry from database and return success

export const verifyOtp = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { otp, verificationId, check } = req.body;
    if (!otp || !verificationId || !check) {
      throw new ApiError("Missing otp or verification", 400);
    }
    const apiDetails: {
      api_key: string;
      id: string;
      user_id: string;
      created_at: Date;
      revoked_at: Date | null;
      otp_count: number;
      custom_msg: string;
      otp_expiration_time: number;
    } = req.apiDetails;

    const apiKey: string = req.apiKey;

    if (!apiDetails) throw new ApiError(`Invalid api-key`, 400);
    if (!apiKey) throw new ApiError(`Invalid api-key`, 400);
    var encodedVerificationKey = await decode(verificationId);
    if (!encodedVerificationKey) {
      throw new ApiError("Invalid verification", 404);
    }
    const detailsObj = JSON.parse(encodedVerificationKey);
    if (detailsObj.check !== check) {
      throw new ApiError("Invalid verification Key", 404);
    }

    const response = await verifyOtpInRedis(
      apiKey,
      otp,
      apiDetails.otp_expiration_time
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
