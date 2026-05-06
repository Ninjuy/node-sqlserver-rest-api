import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../models/user";
import { AppError } from "../middleware/errorHandler";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = registerSchema.parse(req.body);
      const existing = await UserModel.findByEmail(body.email);
      if (existing) throw new AppError(409, "Email already registered");

      const passwordHash = await bcrypt.hash(body.password, 12);
      const user = await UserModel.create({ ...body, passwordHash });

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = loginSchema.parse(req.body);
      const user = await UserModel.findByEmail(body.email);
      if (!user) throw new AppError(401, "Invalid credentials");

      const valid = await bcrypt.compare(body.password, user.passwordHash);
      if (!valid) throw new AppError(401, "Invalid credentials");

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET ?? "",
        { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
      );

      const { passwordHash: _, ...userData } = user;
      res.json({ success: true, data: { user: userData, token } });
    } catch (err) {
      next(err);
    }
  },
};
