import { Router } from "express";
import manageRoomRoutes from "./manage-room.routes.js";
import authRoutes from "./auth.routes.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import bookingRoute from "./booking.routes.js";
import uploadRoutes from "./upload.routes.js";
import manageStaffRoutes from "./manage-staff.routes.js";
import reservationsRoutes from "./reservation.routes.js";
import homePageRoutes from "./home-page.routes.js";
import roomBooking from "./roombooking.route.js"

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

router.use("/auth", authRoutes);

router.use("/home", homePageRoutes);

router.use("/bookings", bookingRoute);

router.use("/roombooking", roomBooking)

router.use(
  "/manage-room",
  authenticate,
  authorize(["admin"]),
  manageRoomRoutes,
);

router.use(
  "/upload",
  authenticate,
  authorize(["admin"]),
  uploadRoutes
);

router.use(
  "/manage-staff",
  authenticate,
  authorize(["admin"]),
  manageStaffRoutes
);

router.use(
  "/reservations",
  authenticate,
  authorize(["admin"]),
  reservationsRoutes
);

// Customer only route
// router.get(
//   "/my-reservations",
//   authenticate,
//   authorize(["customer"]),
//   getMyReservations
// );

export default router;
