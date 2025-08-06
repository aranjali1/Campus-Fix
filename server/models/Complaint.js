import mongoose from "mongoose";


const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title:{
    type:String,
    required:true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Electricity", "Plumbing", "Cleanliness", "Furniture", "Others"],
  },
  location: {
    type: String,
    required: true,
  },
  detailedLocation:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  image:{
    type:[String],
    default:[],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  complaintId:{
    type:String,
    required:true,
    unique:true,
  },
  assignedToProvider:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Servicer",
    default:null,
  },
  providerStatus:{
    type:String,
    enum:["Pending","In Progress","Resolved","Rejected"],
    default:"Pending",
  },
  providerCost:{
    type:Number,
    default:null,
  },
  paymentStatus:{
    type:String,
    enum:["Pending","Paid","Rejected"],
    default:"Pending",
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
