import express, { Express } from "express";
import cors from "cors";
import "dotenv/config";
import { userRouter } from "./router/userRouter";
import { otpRouter } from "./router/otpRouter";
import { apiKeyRouter } from "./router/apiKeyRouter";
export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/api_key", apiKeyRouter);