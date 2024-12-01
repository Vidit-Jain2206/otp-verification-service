import { Request, Response } from "express";
import { client } from "../../client";
import { decode } from "../../helpers/encode";

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
    var encodedVerificationKey = await decode(verificationId);
    if (!encodedVerificationKey) {
      return res.status(404).json({ message: "Invalid verification" });
    }
    const detailsObj = JSON.parse(encodedVerificationKey);
    if (detailsObj.check !== check) {
      return res.status(401).json({ message: "Invalid verification key" });
    }
    const otp_instance = await client.oTP.findFirst({
      where: {
        hashedOtp: otp,
      },
    });
    if (!otp_instance) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (otp_instance?.verified) {
      return res.status(400).json({ message: "OTP is already verified" });
    }
    if (new Date(otp_instance?.expiration_time) < new Date()) {
      await client.oTP.delete({
        where: {
          id: otp_instance.id,
        },
      });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otp_instance.hashedOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    await client.oTP.update({
      where: { id: otp_instance.id },
      data: { verified: true },
    });
    await client.oTP.delete({
      where: {
        id: otp_instance.id,
      },
    });
    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    throw error;
  }
};
