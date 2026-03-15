import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // development mode token
  if (process.env.NODE_ENV === "development") {
    if (token === process.env.DEV_CUSTOMER_TOKEN) {
      (req as any).user = { 
        sub: process.env.DEV_CUSTOMER_ID,
        role: "customer",
        username: "dev_customer"
      };
      return next();
    }
    
    if (token === process.env.DEV_ADMIN_TOKEN) {
      (req as any).user = { 
        sub: process.env.DEV_ADMIN_ID,
        role: "admin",
        username: "dev_admin"
      };
      return next();
    }
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
