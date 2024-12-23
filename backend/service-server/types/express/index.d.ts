declare namespace Express {
  interface Request {
    apiDetails: {
      api_key: string;
      id: string;
      user_id: string;
      created_at: Date;
      revoked_at: Date | null;
      otp_count: number;
      custom_msg: string;
      otp_expiration_time: number;
    };
    apiKey: string;
  }
}

interface OtpData {
  otp: string;
  status: OtpStatus;
  createdAt: Date;
  apiKey: string;
  attempts: number;
  otpExpiration: Date;
}
