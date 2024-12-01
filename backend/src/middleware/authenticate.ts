import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    email: string;
    id: string;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.cookies("access_token");
    if (!token) {
      throw new ApiError("Access denied, no token provided", 403);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      username: string;
      email: string;
      id: string;
    };
    if (!decoded) {
      throw new ApiError("Access denied, invalid token", 403);
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
