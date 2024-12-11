import Redis from "ioredis";

const redis = new Redis("");
enum OtpStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
}

interface OtpData {
  otp: string;
  status: OtpStatus;
  createdAt: number;
  apiKey: string;
  attempts: number;
  otpExpiration: Date;
}
export async function storeOtp(apiKey: string, otp: string, ttl: number) {
  const otpData: OtpData = {
    otp,
    status: OtpStatus.PENDING,
    createdAt: Date.now(),
    apiKey: apiKey,
    attempts: 0,
    otpExpiration: new Date(Date.now() + ttl),
  };
  await redis.set(`otp:${apiKey}`, JSON.stringify(otpData), "EX", ttl / 1000);
}

export async function verifyOtpInRedis(
  apiKey: string,
  otp: string,
  ttl: number
) {
  const storedOtpJson = await redis.get(`otp:${apiKey}`);

  if (!storedOtpJson) {
    return {
      success: false,
      message: "OTP Expired or Not Found",
    };
  }

  const storedOtpData: OtpData = JSON.parse(storedOtpJson);

  // Verify OTP
  if (
    storedOtpData.otp === otp &&
    new Date(storedOtpData.otpExpiration).getTime() < Date.now()
  ) {
    // Update status to verified
    await redis.set(
      `otp:${apiKey}`,
      JSON.stringify({
        ...storedOtpData,
        status: OtpStatus.VERIFIED,
      }),
      "EX",
      ttl / 1000
    );

    // Delete OTP from Redis
    await redis.del(`otp:${apiKey}`);

    return {
      success: true,
      message: "OTP Verified Successfully",
    };
  } else {
    // Increment attempts
    const updatedOtpData = {
      ...storedOtpData,
      attempts: storedOtpData.attempts + 1,
    };

    await redis.set(
      `otp:${apiKey}`,
      JSON.stringify(updatedOtpData),
      "EX",
      ttl / 1000
    );

    return {
      success: false,
      message: "Incorrect OTP",
      remainingAttempts: 3 - updatedOtpData.attempts,
    };
  }
}
