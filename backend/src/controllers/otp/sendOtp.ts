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

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ message: "Invalid phone number" });

    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otp_instance = await client.oTP.create({
      data: {
        hashedOtp: otp,
        expiration_time: new Date(Date.now() + 60 * 60 * 2 * 1000),
        verified: false,
      },
    });

    var details = {
      timestamp: Date.now(),
      check: phoneNumber,
      success: true,
      message: "OTP sent to user",
      otp_id: otp_instance.id,
    };
    const encoded = await encode(JSON.stringify(details));

    await sendOtpNotification(otp, phoneNumber);
    return res
      .status(200)
      .json({ message: "Otp send Successfully", verificationId: encoded });
  } catch (error) {
    throw error;
  }
};
