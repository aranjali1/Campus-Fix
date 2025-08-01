import express from "express";
import {
  approvedAdmin,
  getApprovedAdmins,
  getPendingAdmins,
  rejectAdmin,
  requestAdminRegistration,
  loginAdmin,
  getAdminLocation
} from "../controller/adminController.js";

import { getComplaintsByLocation } from "../controller/complaintController.js";
import { protect, isSuperAdmin, isAdmin,isStudent } from "../middleware/auth.js";

const adminRouter = express.Router();

// Public Routes
adminRouter.post('/register', requestAdminRegistration);
adminRouter.post('/login', loginAdmin);

// SuperAdmin Routes
adminRouter.get('/pending', protect, isSuperAdmin, getPendingAdmins);
adminRouter.put('/approve/:id', protect, isSuperAdmin, approvedAdmin);
adminRouter.delete('/reject/:id', protect, isSuperAdmin, rejectAdmin);
adminRouter.get('/approved', protect, isSuperAdmin, getApprovedAdmins);

// Admin Routes
adminRouter.get("/complaints", protect, isAdmin, getComplaintsByLocation);
adminRouter.get('/location', getAdminLocation);

export default adminRouter;
