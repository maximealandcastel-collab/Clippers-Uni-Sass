import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";
import stripeRouter from "./stripe";
import contactRouter from "./contact";
import cuRouter from "./cu";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/analytics", analyticsRouter);
router.use("/admin", adminRouter);
router.use("/cu", cuRouter);
router.use(stripeRouter);
router.use(contactRouter);

export default router;
