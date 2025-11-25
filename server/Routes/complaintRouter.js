import express from "express";
import { createComplaint, getAllComplaints, getMyComplaints , getAllComplaintsForSuperadmin} from "../controller/complaintController.js";
import { isAdmin, isStudent, protect ,isSuperAdmin} from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { updateComplaintStatus } from "../controller/complaintController.js";


const router = express.Router();

router.post("/", protect,isStudent, upload.array("images",5), createComplaint);
router.get("/my", protect,isStudent, getMyComplaints);
router.get("/",protect,isAdmin,getAllComplaints);
router.put('/:id/status',protect,isAdmin,updateComplaintStatus);
router.get('/all',protect,isSuperAdmin,getAllComplaintsForSuperadmin);

export default router;
