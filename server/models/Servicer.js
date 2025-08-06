import mongoose from "mongoose";

const servicerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  categories: {
    type: [String],
    required: true,
    enum: ['electrician', 'plumber', 'carpenter', 'cleaner', 'other']
  },
  stripeAccountId:{type:String},

  assignedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }]
}, { timestamps: true });

const Servicer = mongoose.model("Servicer", servicerSchema);
export default Servicer;
