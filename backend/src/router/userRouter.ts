import { Router } from "express";
import { signup } from "../controllers/user/signup";
import { login } from "../controllers/user/signin";
export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
