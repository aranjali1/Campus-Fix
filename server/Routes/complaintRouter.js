import express from "express";
import { createComplaint, getAllComplaints, getMyComplaints } from "../controller/complaintController.js";
import { isAdmin, isStudent, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { updateComplaintStatus } from "../controller/complaintController.js";


const router = express.Router();

router.post("/", protect,isStudent, upload.array("images",5), createComplaint);
router.get("/my", protect,isStudent, getMyComplaints);
router.get("/",protect,isAdmin,getAllComplaints);
router.put('/:id/status',protect,isAdmin,updateComplaintStatus);

export default router;
