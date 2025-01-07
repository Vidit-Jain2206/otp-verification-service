import { sendOtpNotification } from "../helpers/SNSclient";
import { redis } from "../redis";

async function init() {
  while (true) {
    const data = await redis.lpop("sms-otp");
    if (!data) {
      console.log("No data found");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    // send the sms
    const { otp, phoneNumber, custom_msg } = JSON.parse(data);
    console.log(
      `Sending OTP: ${otp} to ${phoneNumber} with custom message: ${custom_msg}`
    );
    // send sms here
    await sendOtpNotification(phoneNumber, otp, custom_msg);
  }
}

init();
