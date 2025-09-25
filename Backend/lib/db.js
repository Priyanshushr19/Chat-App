import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("DB connection done "))
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log(error.message);
    }
}