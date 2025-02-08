import mongoose from "mongoose";

export const connectToDatabase = async () => {
    const mongouri = process.env.MONGODB_URI;
    
    if (!mongouri) {
        console.error("❌ Error: Mongo URI not present in .env.local!");
        throw new Error("Mongo URI missing!");
    }

    try {
        await mongoose.connect(mongouri);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        throw new Error(error.message);
    }
};
