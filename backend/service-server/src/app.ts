import express, { Express } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { otpRouter } from "./router/otpRouter";
export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/otp", otpRouter);

app.get("/", (req, res) => {
  res.json({ message: "User endpoint" });
});
