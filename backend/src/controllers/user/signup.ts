import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { client } from "../../client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ApiError("Username or email or password are required", 401);
    }
    const isExists = await client.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        created_at: true,
        updated_at: true,
      },
    });
    if (!isExists) {
      throw new ApiError("Email already exists", 409);
    }
    const hashedPassword: string = await bcryptjs.hash(password, 10);
    const user = await client.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    if (!user) {
      throw new ApiError("Failed to create user", 500);
    }

    const token: string = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET!
    );

    return res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30), // 30 days
      })
      .json({ user, message: "Signup successful" });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
