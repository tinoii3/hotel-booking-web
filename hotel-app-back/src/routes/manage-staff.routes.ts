import { Router } from "express";
import * as staffControllor from '../controllers/manage-staff.controller.js';

const router = Router();

router.get("/staffs", staffControllor.getStaffs);
router.post("/staffs", staffControllor.createStaff);
router.put("/staffs/:id", staffControllor.updateStaff);
router.delete("/staffs/:id", staffControllor.deleteStaff);
router.get("/staff-name", staffControllor.getStaffName);

export default router;