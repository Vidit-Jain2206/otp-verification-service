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

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) throw new ApiError(`Phone number is required`, 400);
    const apiKey: string = req.headers["api-key"] as string;
    const apiDetails = await client.api_key.findFirst({
      where: {
        api_key: apiKey,
      },
    });

    if (!apiDetails) throw new ApiError(`Invalid api-key`, 400);

    const otp = generate(6, {
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

    const otpDetails = await client.otp.create({
      data: {
        otp: otp,
        user_id: apiDetails.user_id,
        api_key: apiKey,
        verified: false,
        ttl: Date.now() + apiDetails.otp_expiration_time,
      },
    });

    if (!otpDetails) {
      throw new ApiError("Failed to create OTP", 500);
    }

    var details = {
      timestamp: Date.now(),
      check: phoneNumber,
      success: true,
      message: "OTP sent to user",
      otp_id: otpDetails.id,
    };

    await sendOtpNotification(otp, phoneNumber);
    const encoded = await encode(JSON.stringify(details));
    return res
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
