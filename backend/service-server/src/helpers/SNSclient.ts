import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const client = new SNSClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_REGION,
});

export const sendOtpNotification = async (
  otp: string,
  phoneNumber: string,
  custom_msg: string
) => {
  try {
    const command = new PublishCommand({
      PhoneNumber: `${phoneNumber}`,
      Message: `${custom_msg} ${otp}`,
    });
    await client.send(command);
  } catch (error) {
    throw error;
  }
};
