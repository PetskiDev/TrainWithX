import userRouter from "./features/users/user.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import creatorRouter from "./features/creators/creator.routes.js";
import planRouter from "./features/plans/plan.routes.js";
import checkoutRouter from "./features/checkout/checkout.routes.js";
import adminRouter from "@src/features/admin/admin.routes.js";
import reviewRouter from "@src/features/reviews/review.routes.js";
import creatorApplicationRouter from "@src/features/creatorApplication/creatorApplication.routes.js";
import completionsRouter from "@src/features/completions/completions.router.js";
import contactRouter from "@src/features/contact/contact.routes.js";

import { Router } from "express";
import { nukeDB } from "@src/utils/nukeDB.js";
import express from "express";
import { paddleWebhookController } from "@src/features/checkout/checkout.controller.js";
const router = Router();
router.post(
  "/webhooks/paddle",
  express.raw({ type: "*/*" }),
  paddleWebhookController
);
router.use(express.json());
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/creators", creatorRouter);
router.use("/creator-application", creatorApplicationRouter);
router.use("/plans", planRouter);
router.use("/checkout", checkoutRouter);
router.use("/reviews", reviewRouter);
router.use("/completions", completionsRouter);
router.use("/contact", contactRouter);
router.delete("/", nukeDB);

export default router;
