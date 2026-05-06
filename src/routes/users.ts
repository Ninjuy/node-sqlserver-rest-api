import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.get("/",       requireAdmin, userController.getAll);
router.get("/:id",                  userController.getById);
router.patch("/:id",                userController.update);
router.delete("/:id", requireAdmin, userController.remove);

export default router;
