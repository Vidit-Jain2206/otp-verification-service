import { Queue } from "bullmq";
import { redis } from "../redis";

const queue = new Queue("otp-sms");

export async function addJobInQueue(
  otp: string,
  phoneNumber: string,
  custom_msg: string
) {
  const response = await redis.lpush(
    "sms-otp",
    JSON.stringify({ otp, phoneNumber, custom_msg })
  );
  console.log(response);
}
