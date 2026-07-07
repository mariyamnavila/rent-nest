import express, { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(UserRole.TENANT), paymentController.createCheckoutSession);
router.post("/confirm", paymentController.handleWebhook);

export const paymentRouter = router;
