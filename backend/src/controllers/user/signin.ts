import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { client } from "../../client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError("Username or email or password are required", 401);
    }
    const isExists = await client.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!isExists) {
      throw new ApiError("Email does not exists.Please Signup", 409);
    }
    const isPassCorrect: boolean = await bcryptjs.compare(
      password,
      isExists.password
    );
    if (!isPassCorrect) {
      throw new ApiError("Invalid Password", 401);
    }

    const token: string = jwt.sign(
      {
        id: isExists.id,
        username: isExists.username,
        email: isExists.email,
      },
      process.env.JWT_SECRET!
    );

    return res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30), // 30 days
      })
      .json({ user: isExists, message: "Signin successfully" });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
