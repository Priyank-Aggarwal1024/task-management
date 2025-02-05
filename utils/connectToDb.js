import mongoose from "mongoose";
export const connectToDatabase = async ()=>{
    const mongouri  = process.env.MONGODB_URI;
    if(!mongouri){
        return new Error("Mongo Uri not present in .env.local!")
    }
    try{
       await mongoose.connect(mongouri);
    }catch(err){
        throw new Error(err.message);
    }
}