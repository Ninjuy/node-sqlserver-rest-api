import type { Response, NextFunction } from "express";
import { z } from "zod";
import { UserModel } from "../models/user";
import { AppError } from "../middleware/errorHandler";
import type { AuthRequest } from "../types";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export const userController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const { users, total } = await UserModel.findAll(page, limit);
      res.json({ success: true, data: users, meta: { page, limit, total } });
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError(400, "Invalid user ID");

      const user = await UserModel.findById(id);
      if (!user) throw new AppError(404, "User not found");

      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError(400, "Invalid user ID");

      // Users can only update themselves unless admin
      if (req.user?.role !== "admin" && req.user?.userId !== id) {
        throw new AppError(403, "Forbidden");
      }

      const dto = updateSchema.parse(req.body);
      const user = await UserModel.update(id, dto);
      if (!user) throw new AppError(404, "User not found");

      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError(400, "Invalid user ID");

      const deleted = await UserModel.delete(id);
      if (!deleted) throw new AppError(404, "User not found");

      res.status(204).send();
    } catch (err) { next(err); }
  },
};
