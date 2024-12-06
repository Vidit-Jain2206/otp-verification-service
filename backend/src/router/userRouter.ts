import { Router } from "express";
import { signup } from "../controllers/user/signup";
import { login } from "../controllers/user/signin";

import { logout } from "../controllers/user/logout";
import { authenticateJWT } from "../middleware/authenticateJWT";
export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", authenticateJWT, logout);
