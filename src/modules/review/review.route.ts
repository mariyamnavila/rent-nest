import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UserRole.TENANT), reviewController.createReview);

export const reviewRouter = router;
