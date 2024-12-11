import { Router } from "express";
import { authenticateApiKey } from "../middleware/authenticateApiKey";
import { sendOtp } from "../controllers/otp/sendOtp";
import { verifyOtp } from "../controllers/otp/verifyOtp";
export const otpRouter = Router();

otpRouter.post("/send-otp", authenticateApiKey, sendOtp);
otpRouter.post("/verify-otp", authenticateApiKey, verifyOtp);
