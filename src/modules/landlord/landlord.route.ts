import { Router } from "express";
import { landlordController } from "./landlord.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/properties", auth(UserRole.LANDLORD), landlordController.createProperty);

export const landlordRouter = router;
