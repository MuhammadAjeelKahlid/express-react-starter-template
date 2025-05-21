import { Router } from "express";
import { userController } from "@/controllers/user.controller";
import { validate } from "@/middleware/validate.middleware";
import { userSchema } from "@/validators/auth.validator";
import { authCheck } from "@/middleware/authCheck.middleware";
import { emailSchema } from "@/validators/auth.validator"; // For validating email param

const router = Router();


router.get("/users", authCheck("admin"), userController.getAll);
router.get("/users/:id", authCheck(), userController.getById);
router.post("/users", validate(userSchema), authCheck("admin"), userController.create);
router.patch("/users/:id",
    validate(userSchema,),
    authCheck(),
    userController.update
);
router.delete("/users/:email", validate(emailSchema), authCheck(), userController.delete);

export default router;
