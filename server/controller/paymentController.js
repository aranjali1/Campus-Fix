import Complaint from "../models/Complaint";


export const createPaymentIntentForProvider=async(req,res)=>{
    try{
        const {complaintId}=req.body;
        const adminId=req.user._id;
        const complaint=await Complaint.findById(complaintId).populate('assignedToProvider');
        if(!complaint)
            {return res.status(404).json({message:"Complaint not found"})
        }
        const provider=complaint.assignedToProvider;
        if(!provider || !provider.stripeAccountId){
            return res.status(400).json({message:"Provider not found or stripe account id not found"})
        }
        if(!complaint.providerCost){
            return res.status(400).json({message:"Provider cost not found"})
        }

        const paymentIntent= await stripe.paymentIntents.create({
            amount:Math.round(complaint.providerCost*100),
            currency:'inr',
            description:`Payment for complaint : ${complaint.title}`,
            payment_method_types:['card'],
            transfer_data:{
                destination:provider.stripeAccountId,
            },
            metadata:{
                complaintId:complaint._id.toString(),
                providerId:provider._id.toString(),
                adminId:adminId.toString(),
            },
            });
            res.status(200).json({clientSecret:paymentIntent.client_secret});
    }catch(err){
        console.log('Error creating payment intent',err);
        res.status(500).json({message:"Error creating payment intent"});
    }
};