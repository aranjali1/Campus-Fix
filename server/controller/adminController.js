import { Admin } from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Complaint from '../models/Complaint.js';
import Servicer from '../models/Servicer.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    const hashedPassword = password; // Insecure - for demo only

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
    res.json({ success: true, approvedAdmins });
  } catch (error) {
    console.error("Error fetching approved admins:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// POST: Admin login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Invalid Credentials" });
    }

    if (admin.status !== "approved") {
      return res.status(403).json({ success: false, message: "Admin account not approved yet" });
    }

    // Password check skipped
    const token = jwt.sign(
      { id: admin._id, role: admin.role, location: admin.location },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

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
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// GET: Admin location list
export const getAdminLocation = async (req, res) => {
  try {
    const admin = await Admin.find({ status: "approved" }).select("location");
    const locations = admin.map((admin) => admin.location);
    res.status(200).json({ success: true, locations });
  } catch (error) {
    console.error("Error fetching admin locations:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// GET: Logged-in admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({
      user: {
        id: admin._id,
        email: admin.email,
        location: admin.location,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST: Assign provider to a complaint
export const assignProvider = async (req, res) => {
  try {
    const { complaintId, providerId } = req.body;

    if (!complaintId || !providerId) {
      return res.status(400).json({ message: "Complaint ID and Provider ID are required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedToProvider: providerId, providerStatus: "Pending" },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await Servicer.findByIdAndUpdate(providerId, {
      $addToSet: { assignedComplaints: complaintId }
    });

    res.json({ message: "Provider assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while assigning provider" });
  }
};

// PUT: Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { complaintId, paymentStatus } = req.body;

    if (!complaintId || !paymentStatus) {
      return res.status(400).json({ message: "Complaint ID and Payment Status are required" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Payment status updated successfully",
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error while updating payment status" });
  }
};

// POST: Create Stripe Payment Intent (admin → provider)
export const createPaymentIntent = async (req, res) => {
  try {
    const { complaintId, amount } = req.body;

    if (!complaintId || !amount) {
      return res.status(400).json({ message: "Complaint ID and amount are required" });
    }

    const complaint = await Complaint.findById(complaintId).populate('assignedToProvider');
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if(!complaint.assignedToProvider?.stripeAccountId){
      return res.status(400).json({ message: "Provider has not been assigned to this complaint"});
    }
    const provider=await Servicer.findById(complaint.assignedToProvider._id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      payment_method_types: ['card'],
      description: `Payment for complaint ID: ${complaintId}`,
      transfer_data: {
        destination: provider.stripeAccountId,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: "Payment intent created successfully"
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ success: false, message: "Server error while creating payment intent" });
  }
};
