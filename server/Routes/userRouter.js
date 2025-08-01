import express from 'express';
import { registerUser,loginUser,getUserData } from '../controller/userController.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();
userRouter.post('/register',(req,res,next)=>{
    req.body.role = 'student'; // Default role for user registration
    next();
}, registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me',protect, getUserData);

export default userRouter;
