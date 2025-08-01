import express from "express";
import jwt from "jsonwebtoken";

const superRouter = express.Router();

superRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.SUPERADMIN_EMAIL && password === process.env.SUPERADMIN_PASSWORD) {
        const token = jwt.sign({ id: 'superadmin', role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            _id: 'superadmin',
            name: 'Campus Name',
            email,
            role: 'superadmin',
            token
        });
    }else{
        return res.status(401).json({message: "Invalid credentials" });
    }
})

export default superRouter;