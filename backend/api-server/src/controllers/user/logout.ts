import { Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { AuthenticatedRequest } from "../../middleware/authenticateJWT";

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const user = req.user;
    res.clearCookie("access_token");
    return res.status(201).json({ message: "User logged out" });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
