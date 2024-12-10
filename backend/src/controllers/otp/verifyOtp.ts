import { Request, Response } from "express";
import { client } from "../../client";
import { decode } from "../../helpers/encode";
import { ApiError } from "../../utils/ApiError";

// 1. accepts the otp, verificationKey
// 2. verify the verificationKey :- check phone number
// 3. verify the otp with expiration time :- if expired return expired and remove the entry from database
// if already verified:- return already verified
// 4. if verified: remove the entry from database and return success

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { otp, verificationId, check } = req.body;
    if (!otp || !verificationId || !check) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const apiKey: string = req.headers["api-key"] as string;
    const apiDetails = await client.api_key.findFirst({
      where: {
        api_key: apiKey,
      },
    });

    if (!apiDetails) throw new ApiError(`Invalid api-key`, 400);
    var encodedVerificationKey = await decode(verificationId);
    if (!encodedVerificationKey) {
      return res.status(404).json({ message: "Invalid verification" });
    }
    const detailsObj = JSON.parse(encodedVerificationKey);
    if (detailsObj.check !== check) {
      return res.status(401).json({ message: "Invalid verification key" });
    }
    const otp_instance = await client.otp.findFirst({
      where: {
        otp: otp,
      },
    });
    if (!otp_instance) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (otp_instance?.verified) {
      return res.status(400).json({ message: "OTP is already verified" });
    }
    if (new Date(otp_instance?.ttl) < new Date()) {
      await client.otp.delete({
        where: {
          id: otp_instance.id,
        },
      });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otp_instance.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const response = client.$transaction(async (client) => {
      await client.otp.update({
        where: { id: otp_instance.id },
        data: { verified: true },
      });
      await client.otp.delete({
        where: {
          id: otp_instance.id,
        },
      });
    });
    if (!response) {
      throw new ApiError("Failed to verify OTP", 500);
    }

    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    throw error;
  }
};
