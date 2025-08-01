import {Admin} from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Complaint from '../models/Complaint.js';

// GET all pending admin registration requests
export const getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await Admin.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json({ success: true, pendingAdmins });
    } catch (error) {
        console.error("Error fetching pending admins:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// POST: Submit a new admin registration request
export const requestAdminRegistration = async (req, res) => {
    const { email, password, location } = req.body;

    if (!email || !password || !location) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "An admin with this email already exists." });
        }

        const hashedPassword =password //await bcrypt.hash(password, 10);

        await Admin.create({
            email,
            password: hashedPassword,
            location,
            status: "pending",
            role: "admin"
        });

        res.json({ success: true, message: "Admin registration request submitted. Please wait for approval." });
    } catch (error) {
        console.error("Error in admin registration request:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// PUT: Approve admin
export const approvedAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);
        if (!admin || admin.status !== "pending") {
            return res.status(404).json({ success: false, message: "Admin not found or already processed." });
        }

        admin.status = "approved";
        await admin.save();

        res.json({ success: true, message: "Admin approved successfully." });
    } catch (error) {
        console.error("Error approving admin:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// DELETE: Reject admin
export const rejectAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);
        if (!admin || admin.status !== "pending") {
            return res.status(404).json({ success: false, message: "Admin not found or already processed." });
        }

        await Admin.findByIdAndDelete(id);

        res.json({ success: true, message: "Admin registration request rejected successfully." });
    } catch (error) {
        console.error("Error rejecting admin:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// GET: All approved admins
export const getApprovedAdmins = async (req, res) => {
    try {
        const approvedAdmins = await Admin.find({ status: "approved", role: "admin" }).sort({ createdAt: -1 });
        res.json({success:true,approvedAdmins});
    } catch (error) {
        console.error("Error fetching approved admins:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// POST: Admin login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(404).json({success:false,message:"Invalid Credentials"});
        }
        if(admin.status !== "approved") {
            return res.status(403).json({success:false,message:"Admin account not approved yet"});
        }
        //const isMatch = await bcrypt.compare(password, admin.password);
        //if (!isMatch) {
        //    return res.status(401).json({success:false,message:"Invalid Credentials"});
        //}
        const token=jwt.sign({ id: admin._id, role: admin.role, location:admin.location }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                location: admin.location,
                role: admin.role
            }
        });
    }catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}

export const getAdminLocation = async (req, res) => {
    try{
        const admin=await Admin.find({status:"approved"}).select("location");
        const locations=admin.map((admin) => admin.location);
        res.status(200).json({success:true,locations});
    }catch(error) {
        console.error("Error fetching admin locations:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}