import { Router } from "express";
import serviceRoutes from "./service.routes.js";
import manageRoomRoutes from "./manage-room.routes.js";
import authRoutes from "./auth.routes.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

router.use("/auth", authRoutes);

router.use("/services", serviceRoutes);

router.use(
  "/manage-room",
  authenticate,
  authorize(["admin"]),
  manageRoomRoutes,
);

// Customer only route
// router.get(
//   "/my-reservations",
//   authenticate,
//   authorize(["customer"]),
//   getMyReservations
// );

export default router;
