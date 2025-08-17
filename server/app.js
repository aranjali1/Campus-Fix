import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import userRouter from './Routes/userRouter.js';
import complaintRouter from './Routes/complaintRouter.js';
import path from 'path';
import adminRouter from './Routes/adminRouter.js';
import superRouter from './Routes/superRouter.js';
import bcrypt from 'bcryptjs';
import providerRouter from './Routes/providerRouter.js';

//bcrypt.compare("hostel","$2b$10$fsdtpcpv5bnwwb898yqzu.ydule6vjmtqxacynx88jlvuwddmzu1a").then(console.log).catch(console.error);

//connect to the database
const startServer = async () => {
    await connectDB();

//initialize express app
const app = express();

//middleware
app.use(cors({ 
    origin: process.env.CLIENT_URL, 
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("welcome to the server");
});
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));


app.use('/api/user', userRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/admin', adminRouter);
app.use('/api/superadmin',superRouter);
app.use('/api/provider',providerRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
};

startServer().catch((error) => {
    console.error("Error starting the server:", error);
    
});






