import Complaint from "../models/Complaint.js";
import {nanoid} from "nanoid";

// ==============================
// @desc    Submit new complaint
// @route   POST /api/complaints
// @access  Private (Student)
// ==============================

export const createComplaint = async (req, res) => {
    try{

        const { title, category, location, description,detailedLocation } = req.body;

        if(!title || !category || !location || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imagePaths=req.files?.map(file=>file.path) || [];

        const complaint = await Complaint.create({
            user: req.user._id,
            title,
            category,
            location,
            description,
            image: imagePaths,
            detailedLocation,
            complaintId:nanoid(5),
        });

        res.status(201).json({
            message: "Complaint created successfully",
            complaint
        });
    }catch(error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// ==============================
// @desc    Get logged-in student's complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
// ==============================

export const getMyComplaints = async (req, res) => {
    try{
        const complaints =await Complaint.find({user: req.user._id}).populate('user', 'name email');
        res.status(200).json(complaints);
        console.log("My Complaints:", complaints);
    }catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email');
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateComplaintStatus = async (req, res) => {
    const {id}= req.params;
    const { status } = req.body;

    try{
        const complaint=await Complaint.findByIdAndUpdate(id,
            { status },
            { new: true }
        );
        if(!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json({
            message: "Complaint status updated successfully",
            complaint,
        });
    }catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getComplaintsByLocation = async (req, res) => {
    try{
        const adminLocation = req.user.location; // Assuming location is stored in the admin's token
        console.log("Admin Location:", adminLocation);
        const complaints=await Complaint.find({location:adminLocation}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(complaints);
    }catch(error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

export const getAllComplaintsForSuperadmin = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    if (!complaints || complaints.length === 0) {
      return res.status(200).json({
        success: true,
        complaints: []
      });
    }

    const formatted = complaints.map((c) => {
      if (!c || !c._id) return null; // skip corrupt docs

      return {
        _id: c._id.toString(),
        title: c.title || "Untitled",
        description: c.description || "",
        category: c.category || "General",
        location: c.location || "Unknown",
        status: c.status || "pending",
        createdAt: c.createdAt || null,
        updatedAt: c.updatedAt || null,
      };
    }).filter(Boolean); // remove null entries

    res.status(200).json({
      success: true,
      complaints: formatted,
    });

  } catch (error) {
    console.error("Superadmin complaint fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
      error: error.message,
    });
  }
};


