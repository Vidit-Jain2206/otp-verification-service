// 1. accepts the phoneNumber
// 2. generate the Otp
// 3. save the otp in database with expiration time
// 4. send the otp to the phonenumber
// 5. create the verification id for the phonenumber and otp
// 6. return this verification id to client

import { Response, Request } from "express";
import { client } from "../../client";
import { generate } from "otp-generator";
import { encode } from "../../helpers/encode";
import { sendOtpNotification } from "../../helpers/SNSclient";
import { ApiError } from "../../utils/ApiError";
import { storeOtp } from "../../redis";
import crypto from "crypto";
import { AuthenticatedRequest } from "../../middleware/authenticateApiKey";
export const sendOtp = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phoneNumber }: { phoneNumber: string } = req.body;
    if (!phoneNumber) throw new ApiError(`Phone number is required`, 400);
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
    const otp: string = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    if (!apiDetails.otp_expiration_time) {
      throw new ApiError(`OTP expiration time is not set in API key`, 400);
    }
    if (!apiDetails.custom_msg) {
      throw new ApiError(`Custom message is not set in API key`, 400);
    }

    await sendOtpNotification(otp, phoneNumber, apiDetails.custom_msg);
    var details = {
      timestamp: Date.now(),
      check: phoneNumber,
      success: true,
      message: "OTP sent to user",
    };

    await storeOtp(apiKey, otp, apiDetails.otp_expiration_time);
    const encoded = await encode(JSON.stringify(details));
    res
      .status(200)
      .json({ message: "Otp send Successfully", verificationId: encoded });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// handle edge cases
// like delete the otp instance if not successfully send or mark it verified:false
