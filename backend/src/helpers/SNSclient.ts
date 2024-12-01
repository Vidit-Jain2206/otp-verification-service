import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const client = new SNSClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_REGION,
});

export const sendOtpNotification = async (otp: string, phoneNumber: string) => {
  try {
    const command = new PublishCommand({
      PhoneNumber: `+91${phoneNumber}`,
      Message: `Your OTP is ${otp}`,
    });

    await client.send(command);
  } catch (error) {
    throw error;
  }
};
