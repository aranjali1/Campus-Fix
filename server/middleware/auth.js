import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Admin } from '../models/Admin.js';

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;

        // Super Admin
        if (role === 'superadmin') {
            req.user = {
                _id: id,
                name: 'Campus Name',
                email: process.env.SUPERADMIN_EMAIL,
                role: 'superadmin'
            };
            return next();
        }

        // Student
        if (role === 'student') {
            const user = await User.findById(id).select('-password');
            if (user) {
                req.user = user;
                return next();
            }
        }

        // Admin
        if (role === 'admin') {
            const admin = await Admin.findById(id).select('-password');
            //console.log(admin);
            if (admin && admin.status === 'approved') {
                req.user = {
                    _id: admin._id,
                    email: admin.email,
                    location: admin.location,
                    role: 'admin'
                };
                return next();
            }
        }

        return res.status(401).json({ message: "Not authorized, user not found or not approved" });
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: "Access denied, not a student" });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, not an admin" });
    }
    next();
};

export const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied, not a superadmin" });
    }
    next();
};
