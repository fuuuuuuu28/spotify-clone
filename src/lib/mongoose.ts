import mongoose from "mongoose"

export const connectionToDatabase = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL!)
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
}