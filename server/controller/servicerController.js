import Servicer from "../models/Servicer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Complaint from "../models/Complaint.js"; // Added import for Complaint
import stripePackage from 'stripe';


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined in .env");

// 📌 Register a new Service Provider
export const registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, categories } = req.body;

    // Check for existing provider
    const existingProvider = await Servicer.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create provider
    const provider = new Servicer({
      name,
      email,
      phone,
      password: hashedPassword,
      categories,
    });

    await provider.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// 📌 Login for Service Provider
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    const provider = await Servicer.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: provider._id, role: "provider" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        categories: provider.categories,
        role:'provider',
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getAssignedComplaints=async (req,res)=>{
    try {
    const providerId = req.user._id; 

    const provider = await Servicer.findById(providerId).populate('assignedComplaints');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ complaints: provider.assignedComplaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
}

export const getProviderProfile=(req,res)=>{
  if(!req.user){
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({
    _id:req.user._id,
    name:req.user.name,
    email:req.user.email,
    phone:req.user.phone,
    role:'provider',
  });
}

export const getProviders=async (req,res)=>{
  try{
    const {category}=req.query;
    if(!category){
      return res.status(400).json({message:'Category is required'});
    }
    // Map complaint categories to provider categories
    const categoryMap = {
      'Electricity': 'electrician',
      'Cleanliness': 'cleaner', 
      'Furniture': 'carpenter',
      'Plumbing': 'plumber',
      'Others': 'other'
    };

    const providerCategory = categoryMap[category] || category;
    const providers = await Servicer.find({ categories: providerCategory });
    res.json(providers);
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error while fetching providers'});
  }
  }

export const updateProviderStatus = async (req, res) => {
  try {
    const { complaintId, providerStatus } = req.body;
    const providerId = req.user._id;

    if (!complaintId || !providerStatus) {
      return res.status(400).json({ message: 'Complaint ID and Provider Status are required' });
    }

    // Check if the complaint is assigned to this provider
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedToProvider?.toString() !== providerId?.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this complaint' });
    }

    // Update the provider status
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { providerStatus },
      { new: true }
    );

    res.json({ 
      message: 'Provider status updated successfully',
      complaint: updatedComplaint 
    });
  } catch (err) {
    console.error('Error updating provider status:', err);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

export const updateProviderCost = async (req, res) => {
  try {
    const { complaintId, providerCost } = req.body;
    const providerId = req.user._id;

    if (!complaintId) {
      return res.status(400).json({ message: 'Complaint ID is required' });
    }

    // Check if the complaint is assigned to this provider
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedToProvider?.toString() !== providerId?.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this complaint' });
    }

    // Update the provider cost
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { providerCost: providerCost || null },
      { new: true }
    );

    res.json({ 
      message: 'Provider cost updated successfully',
      complaint: updatedComplaint 
    });
  } catch (err) {
    console.error('Error updating provider cost:', err);
    res.status(500).json({ message: 'Server error while updating cost' });
  }
};

const stripe=stripePackage(process.env.STRIPE_SECRET_KEY);

export const createStripeAccount=async(req,res)=>{
  try{
    const provider= await Servicer.findById(req.params.id);
    if(!provider) {
      return res.status(404).json({ message: 'Provider not found' });
  }
  if(!provider.stripeAccountId){
    const account=await stripe.accounts.create({
      type: 'express',
      country: 'US',
      capabilities:{
        card_payments:{requested:true},
        transfers:{requested:true}
      },
    });
    provider.stripeAccountId=account.id;
    await provider.save();
  }
  const accountLink=await stripe.accountLinks.create({
    account: provider.stripeAccountId,
    refresh_url:'http://localhost:5173/provider/onboarding/refresh',
    return_url:'http://localhost:5173/provider/onboarding',
    type:'account_onboarding',
  });
  res.status(200).json({url:accountLink.url});
}catch(err){
  console.error('Error creating stripe account:', err);
  res.status(500).json({err:'Stripe onboarding failed'});
}
};