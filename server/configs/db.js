import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connection successful");
        });
        await mongoose.connect(`${process.env.MONGO_URI}/campusFix`); 
    }catch(err) {
        console.error("MongoDB connection failed", err);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;