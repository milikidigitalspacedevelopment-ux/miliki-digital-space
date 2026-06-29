import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controllers/roleController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { roleValidation } from "../validations/userValidation.js";

const router = express.Router();

router.get("/", authenticate, authorize(["admin", "super-admin"]), getRoles);
router.post("/", authenticate, authorize(["super-admin"]), validate(roleValidation), createRole);
router.put("/:id", authenticate, authorize(["super-admin"]), validate(roleValidation), updateRole);
router.delete("/:id", authenticate, authorize(["super-admin"]), deleteRole);

export default router;
