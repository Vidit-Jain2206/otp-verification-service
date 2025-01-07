import Redis from "ioredis";

const url = process.env.REDIS_URL || "";
export const redis = new Redis("127.0.0.1:6379");
enum OtpStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
}

export async function storeOtp(
  apiKey: string,
  phoneNumber: string,
  otp: string,
  ttl: number
) {
  const otpData: OtpData = {
    otp,
    status: OtpStatus.PENDING,
    createdAt: new Date(Date.now()),
    apiKey: apiKey,
    attempts: 0,
    otpExpiration: new Date(Date.now() + ttl),
  };
  await redis.set(
    `OTP:${apiKey}:${phoneNumber}`,
    JSON.stringify(otpData),
    "EX",
    ttl / 1000
  );
}

export async function verifyOtpInRedis(
  apiKey: string,
  phoneNumber: string,
  otp: string,
  ttl: number
) {
  const storedOtpJson = await redis.get(`OTP:${apiKey}:${phoneNumber}`);

  if (!storedOtpJson) {
    return {
      success: false,
      message: "OTP Expired or Not Found",
    };
  }

  const storedOtpData: OtpData = JSON.parse(storedOtpJson);

  // Verify OTP
  if (storedOtpData.attempts >= 3) {
    await redis.del(`OTP:${apiKey}:${phoneNumber}`);
    return {
      success: false,
      message: "OTP Expired or Not Found",
    };
  }
  if (
    storedOtpData.otp === otp &&
    new Date(storedOtpData.otpExpiration).getTime() >= Date.now()
  ) {
    // Update status to verified
    await redis.set(
      `OTP:${apiKey}:${phoneNumber}`,
      JSON.stringify({
        ...storedOtpData,
        status: OtpStatus.VERIFIED,
      }),
      "EX",
      ttl / 1000
    );

    // Delete OTP from Redis
    await redis.del(`OTP:${apiKey}:${phoneNumber}`);

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
      `OTP:${apiKey}:${phoneNumber}`,
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
