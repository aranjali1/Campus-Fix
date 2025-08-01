import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{type:String, enum:["student","admin","superadmin"], default:"student"},
    verifyOtp:{type: String, default: ''},
    verifyOtpExpires:{type: Number, default: 0},
    isVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpires: {type: Number, default: 0},
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;