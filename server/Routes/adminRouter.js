import express from "express";
import {
  approvedAdmin,
  getApprovedAdmins,
  getPendingAdmins,
  rejectAdmin,
  requestAdminRegistration,
  getAdminProfile,
  loginAdmin,
  getAdminLocation,
  assignProvider,
  updatePaymentStatus,
  createPaymentIntent,
  handleRemoveApprovedAdmin
} from "../controller/adminController.js";
import { upload } from "../middleware/upload.js";
import { getComplaintsByLocation } from "../controller/complaintController.js";
import { getProviders } from "../controller/servicerController.js";
import { protect, isSuperAdmin, isAdmin,isStudent } from "../middleware/auth.js";


const adminRouter = express.Router();

// Public Routes
adminRouter.post('/register',upload.single("idProof"), requestAdminRegistration);
adminRouter.post('/login', loginAdmin);

// SuperAdmin Routes
adminRouter.get('/pending', protect, isSuperAdmin, getPendingAdmins);
adminRouter.put('/approve/:id', protect, isSuperAdmin, approvedAdmin);
adminRouter.delete('/reject/:id', protect, isSuperAdmin, rejectAdmin);
adminRouter.get('/approved', protect, isSuperAdmin, getApprovedAdmins);

// Admin Routes
adminRouter.get("/complaints", protect, isAdmin, getComplaintsByLocation);
adminRouter.get('/location', getAdminLocation);
adminRouter.get('/me', protect, isAdmin, getAdminProfile);
adminRouter.get('/providers',getProviders);
adminRouter.post('/assign',protect,isAdmin,assignProvider);
adminRouter.put('/update-payment', protect, isAdmin, updatePaymentStatus);
adminRouter.post('/create-payment-intent', protect, isAdmin, createPaymentIntent);
adminRouter.delete('/remove/:id', protect, isSuperAdmin, handleRemoveApprovedAdmin);


export default adminRouter;
