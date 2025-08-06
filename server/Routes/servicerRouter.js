// routes/providerRoutes.js
import express from 'express';
import { registerProvider, loginProvider, getAssignedComplaints, getProviderProfile, updateProviderStatus, updateProviderCost, createStripeAccount } from '../controller/servicerController.js';
import { isProvider, protect } from '../middleware/auth.js';

const providerRouter = express.Router();

providerRouter.post('/register', registerProvider);
providerRouter.post('/login', loginProvider);
providerRouter.get('/assigned', protect, isProvider, getAssignedComplaints);
providerRouter.get('/me', protect, isProvider, getProviderProfile);
providerRouter.put('/update-status', protect, isProvider, updateProviderStatus);
providerRouter.put('/update-cost', protect, isProvider, updateProviderCost);
providerRouter.get('/create-stripe-account/:id',protect,isProvider,createStripeAccount);

export default providerRouter;
