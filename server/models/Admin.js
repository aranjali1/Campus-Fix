import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true, lowercase: true,trim: true},
    location: {type: String, required: true},
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"]
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin"]
    }
}, {
    timestamps: true
});
export const Admin = mongoose.model("Admin", adminSchema);